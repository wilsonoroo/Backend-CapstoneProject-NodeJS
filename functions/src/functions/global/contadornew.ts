import { firestore } from 'firebase-admin';
import { Documento } from '../../core/models';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import {  getCounterValue, incrementCounterBy, initCounter } from '../../core/services/contadorDistribuido/contadorDistribuido';
import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';


export const contando = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentos/{docId}", async(event) => {
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

        const getCountPaths = (estado: string, emisorId: string): string[] => {
            const basePath = `empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosUsuarios/${emisorId}/contadores/`;
            let paths: string[] = [];        
            if (['estadoA', 'estadoB', 'estadoC'].includes(estado)) {
                paths = [...paths, basePath + `countABC`];
            }
            if (['pendiente_doble_chequeo'].includes(estado)) {
                paths = [...paths, basePath + `countenEsperaDobleChequeo`];
            }
            if (['pendiente_validar', 'doc_con_problema', 'doc_sin_problema'].includes(estado)) {
                paths = [...paths, basePath + `countenEsperaValidacion`, basePath + `countporValidar`];
            }
            if (['rechazado'].includes(estado)) {
                paths = [...paths, basePath + `countrechazados`];
            }
            if (['finalizado'].includes(estado)) {
                paths = [...paths, basePath + `countFinalizado`];
            }
            if (['finalizado', 'finalizado_con_problema', 'finalizado_sin_problema'].includes(estado)) {
                paths = [...paths, basePath + `countprocesoFinalizado`];
            }
            
            return paths;
        };

        const processCounter = async (estado: string, emisorId: string, factor: number) => {
            const rootPaths = getCountPaths(estado, emisorId);
            for (const rootPath of rootPaths) {
                await initCounter(db, rootPath, numShards);
                await incrementCounterBy(db, rootPath, numShards, factor);
                await updateTotalCounterValue(db, rootPath);
            }
        };
        const getDocumentFolderPath = (estado: string, emisorId: string): string[] => {
            const basePath = `empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosUsuarios/${emisorId}/`;
            let paths: string[] = [];
            
            if (['estadoA', 'estadoB', 'estadoC'].includes(estado)) {
                paths = [...paths, `${basePath}countABC`];
            }
            if (estado === 'pendiente_doble_chequeo') {
                paths = [...paths, `${basePath}enEsperaDobleChequeo`];
            }
            if (['pendiente_validar', 'doc_con_problema', 'doc_sin_problema'].includes(estado)) {
                paths = [...paths, `${basePath}enEsperaValidacion`];
            }
            if (estado === 'rechazado') {
                paths = [...paths, `${basePath}countrechazados`];
            }
            if (estado === 'finalizado') {
                paths = [...paths, `${basePath}countFinalizado`];
            }
            if (['finalizado', 'finalizado_con_problema', 'finalizado_sin_problema'].includes(estado)) {
                paths = [...paths, `${basePath}countprocesoFinalizado`];
            }
            
            return paths; 
        };

        const emisorId = dataAfter.emisor.id;
        const integrantes = dataAfter.cuadrilla?.integrantes || {};

        const updateForUser = async (userId: string, oldEstado?: string, newEstado?: string) => {
            if (oldEstado) {
                await processCounter(oldEstado, userId, -1);
                const oldRutasDoc = getDocumentFolderPath(oldEstado, userId);
                for (const oldRutaDoc of oldRutasDoc) {
                    const oldRepo = new FirestoreRepository<Documento>(oldRutaDoc);
                    oldRepo.deleteDocument(event.params.docId);
                }
            }

            if (newEstado) {
                await processCounter(newEstado, userId, 1);
                const newRutasDoc = getDocumentFolderPath(newEstado, userId);
                for (const newRutaDoc of newRutasDoc) {
                    const newRepo = new FirestoreRepository<Documento>(newRutaDoc);
                    newRepo.addDocumentById(event.params.docId, dataAfter);
                }
            }
        };

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
    const totalCounterFieldName = `total${rootPath.split('/').pop()}`;
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