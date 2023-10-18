import { firestore } from 'firebase-admin';
import { Documento } from '../../core/models';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getCounterValue, incrementCounterBy, initCounter } from '../../core/services/contadorDistribuido/contadorDistribuido';
// import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';

/**
 * @function myfunctionk
 * Función Cloud que gestiona los contadores asociados a los documentos, basándose en sus estados y emisores.
 * Se activa cuando un documento es creado o modificado.
 *
 * @param {event} - Contiene los datos asociados al evento que activó la función.
 * 
 * @example
 * myfunctionk(event);
 */

export const myfunctionk = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentos/{docId}", async(event) => {
    try {
        const snapshot = event.data;
        
        if (!snapshot) {
            console.log("No data associated with the event");
            return;
        }

        const dataBefore = snapshot.before.data() as Documento | undefined;
        const dataAfter = snapshot.after.data() as Documento;
        
        const db = firestore(); 
        const numShards = 10; 

        const getRootPath = (estado: string, emisorId: string) => 
            `empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosUsuarios/${emisorId}/contadores/count_${estado}`;

        const emisorId = dataAfter.emisor.id;

        if (!dataBefore) {
            console.log(`Documento nuevo detectado con ID: ${event.params.docId}`);
            const rootPath = getRootPath(dataAfter.estado, emisorId);
            await handleCounter(db, rootPath, numShards, 1, dataAfter.estado);

            await duplicateDocumentInStatusCollection(db, event.params, dataAfter, emisorId);

            await handleCuadrillaLogic(db, event.params, dataAfter, "increment", getRootPath);
        } else if (dataBefore.estado !== dataAfter.estado) { 
            console.log(`Cambio de estado detectado en documento ID: ${event.params.docId}. De "${dataBefore.estado}" a "${dataAfter.estado}"`);

            const rootPathBefore = getRootPath(dataBefore.estado, emisorId);
            await handleCounter(db, rootPathBefore, numShards, -1, dataBefore.estado);
            
            const rootPathAfter = getRootPath(dataAfter.estado, emisorId);
            await handleCounter(db, rootPathAfter, numShards, 1, dataAfter.estado);

            await moveDocumentToNewStatusCollection(db, event.params, dataBefore, dataAfter, emisorId);

            await handleCuadrillaLogic(db, event.params, dataBefore, "decrement", getRootPath);
            await handleCuadrillaLogic(db, event.params, dataAfter, "increment", getRootPath);
            
        }
    } catch (error) {
        console.error(`Error al procesar el documento ID: ${event.params.docId}. Detalle del error:`, error);
    }
});


/**
 * Duplica un documento en la colección correspondiente basada en el estado del documento.
 *
 * @param {FirebaseFirestore.Firestore} db - La instancia de Firestore.
 * @param {any} params - Parámetros que contienen información del documento y su estructura de ruta.
 * @param {Documento} data - Datos del documento a duplicar.
 * @param {string} emisorId - ID del emisor del documento.
 * 
 * @example
 * await duplicateDocumentInStatusCollection(db, params, dataAfter, emisorId);
*/
async function duplicateDocumentInStatusCollection(db: FirebaseFirestore.Firestore, params: any, data: Documento, emisorId: string) {
    const docPath = `empresas/${params.idEmpresa}/gerencias/${params.idGerencia}/divisiones/${params.idDivision}/documentosUsuarios/${emisorId}/${data.estado}/${params.docId}`;
    await db.doc(docPath).set(data);
}

/**
 * Mueve un documento de su estado/campo anterior a uno nuevo.
 * Esta función garantiza que el documento se elimine de la colección/estado anterior y se agregue al nuevo estado/campo.
*
* @param {FirebaseFirestore.Firestore} db - La instancia de Firestore.
* @param {any} params - Parámetros que contienen información del documento y su estructura de ruta.
* @param {Documento} dataBefore - Datos previos del documento antes del cambio.
 * @param {Documento} dataAfter - Nuevos datos del documento después del cambio.
 * @param {string} emisorId - ID del emisor del documento.
 * 
 * @example
 * await moveDocumentToNewStatusCollection(db, params, dataBefore, dataAfter, emisorId);
*/
async function moveDocumentToNewStatusCollection(db: FirebaseFirestore.Firestore, params: any, dataBefore: Documento, dataAfter: Documento, emisorId: string) {
    const oldDocPath = `empresas/${params.idEmpresa}/gerencias/${params.idGerencia}/divisiones/${params.idDivision}/documentosUsuarios/${emisorId}/${dataBefore.estado}/${params.docId}`;
    const newDocPath = `empresas/${params.idEmpresa}/gerencias/${params.idGerencia}/divisiones/${params.idDivision}/documentosUsuarios/${emisorId}/${dataAfter.estado}/${params.docId}`;
    
    await db.runTransaction(async (t) => {
        t.delete(db.doc(oldDocPath));
        t.set(db.doc(newDocPath), dataAfter);
    });
}

/**
 * @function handleCounter
 * Gestiona la lógica de actualización de los contadores en Firestore.
 * 
 * @param {db} - Referencia a la instancia de Firestore.
 * @param {rootPath} - Ruta al contador en Firestore.
 * @param {numShards} - Número de fragmentos para la contabilidad distribuida.
 * @param {value} - Valor para incrementar/decrementar el contador.
 * @param {estado} - Estado del documento.
 * 
 * @example
 * await handleCounter(db, rootPath, 10, 1, "validado");
 */
async function handleCounter(db: firestore.Firestore, rootPath: string, numShards: number, value: number, estado: string) {
    // Referencia a la colección de fragmentos de contadores.
    const shardsCollectionRef = db.collection(`${rootPath}/shards`);
    const snapshotCounter = await shardsCollectionRef.limit(1).get();

    // Si los contadores no están inicializados, inicialízalos.
    if (snapshotCounter.empty) {
        console.log(`Inicializando contador para el estado: ${estado} en path: ${rootPath}`);
        await initCounter(db, rootPath, numShards);
    }
    
    // Incrementar/decrementar el contador.
    await incrementCounterBy(db, rootPath, numShards, value);
    console.log(`Actualizado contador para el estado: ${estado} en path: ${rootPath}`);
    
    // Calcular y actualizar el contador total en Firestore.
    const totalCount = await getCounterValue(db, rootPath);
    
    // Ruta donde almacenar el contador total.
    const totalCounterPath = rootPath.substring(0, rootPath.lastIndexOf('/contadores/count_'));
    
    // Actualizar el contador total en Firestore.
    await db.doc(totalCounterPath).set({ [`countTotal${capitalize(estado)}`]: totalCount }, { merge: true });
    console.log(`Actualizado contador total para el estado: ${estado} a ${totalCount} en path: ${totalCounterPath}`);
}

/**
 * @function capitalize
 * Capitaliza la primera letra de una cadena.
 * 
 * @param {str} - Cadena de texto a capitalizar.
 * @returns {string} - Cadena con la primera letra en mayúscula.
 * 
 * @example
 * capitalize("validado"); // Retorna "Validado"
*/
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Maneja la lógica relacionada con la cuadrilla para duplicar documentos y actualizar contadores.
 *
 * @param {FirebaseFirestore.Firestore} db - La instancia de Firestore.
 * @param {any} params - Parámetros que incluyen identificadores para construir la ruta del documento.
 * @param {Documento} data - Los datos del documento a duplicar.
 * @param {"increment" | "decrement"} operation - Operación a realizar en los contadores (incrementar o decrementar).
 * @param {(estado: string, emisorId: string) => string} getRootPath - Función que genera la ruta base para el contador.
 *
 * @throws {FirebaseFirestore.FirestoreError} - Lanza un error si la operación en Firestore falla.
 * 
 * @example
 * await handleCuadrillaLogic(db, params, data, "increment", getRootPath);
 */
async function handleCuadrillaLogic(
    db: FirebaseFirestore.Firestore, 
    params: any, 
    data: Documento, 
    operation: "increment" | "decrement", 
    getRootPath: (estado: string, emisorId: string) => string
) {
    if(data.cuadrilla && data.cuadrilla.integrantes) {
        for(const userId of Object.keys(data.cuadrilla.integrantes)) {
            await duplicateDocumentForUser(db, params, data, userId);

            const rootPath = getRootPath(data.estado, userId);
            const numShards = 10;
            const value = operation === "increment" ? 1 : -1;
            await handleCounter(db, rootPath, numShards, value, data.estado);
        }
    }
}

/**
 * Duplica un documento para un usuario específico.
 *
 * @param {FirebaseFirestore.Firestore} db - La instancia de Firestore.
 * @param {any} params - Parámetros que incluyen identificadores para construir la ruta del documento.
 * @param {Documento} data - Los datos del documento a duplicar.
 * @param {string} userId - El ID del usuario para el que se duplicará el documento.
 *
 * @throws {FirebaseFirestore.FirestoreError} - Lanza un error si la operación en Firestore falla.
 * 
 * @example
 * await duplicateDocumentForUser(db, params, data, userId);
 */
async function duplicateDocumentForUser(db: FirebaseFirestore.Firestore, params: any, data: Documento, userId: string) {
    const docPath = `empresas/${params.idEmpresa}/gerencias/${params.idGerencia}/divisiones/${params.idDivision}/documentosUsuarios/${userId}/${data.estado}/${params.docId}`;
    await db.doc(docPath).set(data);
}