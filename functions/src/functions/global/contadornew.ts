import { firestore } from 'firebase-admin';
import { Documento } from '../../core/models';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import {  getCounterValue, incrementCounterBy, initCounter } from '../../core/services/contadorDistribuido/contadorDistribuido';
import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';
/**
 * Función Cloud de Firebase que se dispara cuando se escribe un documento en la ruta especificada (creado, actualizado o eliminado).
 * Principalmente se usa para administrar contadores distribuidos en base al estado de los datos del "Documento".
 */
export const contadorDistribuidoParaUsuario = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentos/{docId}", async(event) => {
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
        // Obtener las rutas de los contadores basados en el estado y el ID del emisor.
        const getCountPaths = (estado: string, emisorId: string): string[] => {
            const basePath = `empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosUsuarios/${emisorId}/contadores/`;
            let paths: string[] = [];        
            if (['finalizado', 'finalizado_con_problema', 'finalizado_sin_problema', 'finalizado_sin_plan_accion'].includes(estado)) {
                paths = [...paths, basePath + `countEnviadosHSEQ`];
            }
            if (['pendiente_validar', 'doc_con_problemas', 'doc_sin_problemas'].includes(estado)) {
                paths = [...paths, basePath + `countEnEsperaValidacion`, basePath + `countPorValidar`];
            }
            if (['pendiente_doble_chequeo'].includes(estado)) {
                paths = [...paths, basePath + `countEnEsperaDobleChequeo`];
            }
            if (['rechazado'].includes(estado)) {
                paths = [...paths, basePath + `countRechazados`];
            }
            if (['finalizado_sin_plan_accion', 'doc_con_problemas'].includes(estado)) {
                paths = [...paths, basePath + `countProcesoPendiente`];
            }
            if (['finalizado'].includes(estado)) {
                paths = [...paths, basePath + `countProcesoFinalizado`, basePath + 'countFinalizado'];
            }
            
            return paths;
        };
        // Obtiene la ruta de la carpeta del documento basada en el estado y el ID del emisor.
        const getDocumentFolderPath = (estado: string, emisorId: string): string[] => {
            const basePath = `empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosUsuarios/${emisorId}/`;
            let paths: string[] = [];
            
            if (['finalizado', 'finalizado_con_problema', 'finalizado_sin_problema', 'finalizado_sin_plan_accion'].includes(estado)) {
                paths = [...paths, `${basePath}enviadoHSEQ`];
            }
            if (['pendiente_validar', 'doc_con_problemas', 'doc_sin_problemas'].includes(estado)) {
                paths = [...paths, `${basePath}enEsperaValidacion`, basePath + `porValidar`];
            }
            if (estado === 'pendiente_doble_chequeo') {
                paths = [...paths, `${basePath}enEsperaDobleChequeo`];
            }
            if (estado === 'rechazado') {
                paths = [...paths, `${basePath}rechazados`];
            }
            if (['finalizado_sin_plan_accion', 'doc_con_problemas'].includes(estado)) {
                paths = [...paths, `${basePath}procesoPendiente`];
            }
            if (['finalizado'].includes(estado)) {
                paths = [...paths, `${basePath}procesoFinalizado`, basePath + 'finalizado'];
            }
            
            return paths; 
        };
        // Procesa y actualiza los valores del contador.
        const processCounter = async (estado: string, emisorId: string, factor: number) => {
            const rootPaths = getCountPaths(estado, emisorId);
            for (const rootPath of rootPaths) {
                await initCounter(db, rootPath, numShards);
                await incrementCounterBy(db, rootPath, numShards, factor);
                await updateTotalCounterValue(db, rootPath);
            }
        };
        /** Manipula documentos en Firestore basado en el estado, emisor y acción especificados. */
        const processDocument = async (estado: string, emisorId: string, action: 'add' | 'delete') => {
            const documentPaths = getDocumentFolderPath(estado, emisorId);
            for (const docPath of documentPaths) {
                const repo = new FirestoreRepository<Documento>(docPath);
                if (action === 'add') {
                    repo.addDocumentById(event.params.docId, dataAfter);
                } else if (action === 'delete') {
                    repo.deleteDocument(event.params.docId);
                }
            }
        };

        const emisorId = dataAfter.emisor.id;
        const integrantes = dataAfter.cuadrilla?.integrantes || {};

        
        const processedUsersForOldState = new Set<string>();
        const processedUsersForNewState = new Set<string>();
        
        // Actualiza el documento y los contadores para un usuario específico.
        const updateForUser = async (userId: string, oldEstado?: string, newEstado?: string) => {
            // Verifica si el estado anterior del usuario ya ha sido procesado
            if (oldEstado && !processedUsersForOldState.has(userId)) {
                await processCounter(oldEstado, userId, -1);
                await processDocument(oldEstado, userId, 'delete');
                processedUsersForOldState.add(userId);
            }

            // Verifica si el nuevo estado del usuario ya ha sido procesado
            if (newEstado && !processedUsersForNewState.has(userId)) {
                await processCounter(newEstado, userId, 1);
                await processDocument(newEstado, userId, 'add');
                processedUsersForNewState.add(userId);
            }
        };

        // Lógica para determinar si el documento es nuevo o si ha cambiado su estado, y actuar en consecuencia.
        if (!dataBefore) {
            console.log(`Documento nuevo detectado con ID: ${event.params.docId}`);
            
            await updateForUser(emisorId, undefined, dataAfter.estado);
            
            for (const integranteId in integrantes) {
                await updateForUser(integranteId, undefined, dataAfter.estado);
            }

        } else if (dataBefore.estado !== dataAfter.estado) {
            console.log(`Cambio de estado detectado en documento ID: ${event.params.docId}. De "${dataBefore.estado}" a "${dataAfter.estado}"`);
            
            await updateForUser(emisorId, dataBefore.estado, dataAfter.estado);
            
            for (const integranteId in integrantes) {
                await updateForUser(integranteId, dataBefore.estado, dataAfter.estado);
            }
        }

    } catch (error) {
        console.error(`Error al procesar el documento ID: ${event.params.docId}. Detalle del error:`, error);
    }
});

/**
 * Actualiza el valor total del contador en la ruta especificada.
 * @param db - Instancia de Firestore.
 * @param rootPath - Ruta raíz del contador distribuido.
 */
async function updateTotalCounterValue(db: firestore.Firestore, rootPath: string) {
    const totalCount = await getCounterValue(db, rootPath);
    const totalCounterFieldName = `${rootPath.split('/').pop()}`;
    const docPath = rootPath.substring(0, rootPath.lastIndexOf('/contadores/'));
    
    const docRef = db.doc(docPath);
    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists) {
            const newData: { [key: string]: any } = {};
            newData[totalCounterFieldName] = totalCount;
            transaction.set(docRef, newData);
        } else {
            transaction.update(docRef, { [totalCounterFieldName]: totalCount });
        }
    });
}