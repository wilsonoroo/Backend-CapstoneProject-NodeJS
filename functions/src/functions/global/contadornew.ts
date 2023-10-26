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
        const getDocumentFolderPath = (estado: string, emisorId: string): string => {
            const basePath = `empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosUsuarios/${emisorId}/`;
        
            if (['estadoA', 'estadoB', 'estadoC'].includes(estado)) {
                return `${basePath}countABC`;
            } else if (estado === 'pendiente_doble_chequeo') {
                return `${basePath}enEsperaDobleChequeo`;
            } else if (['pendiente_validar', 'doc_con_problema', 'doc_sin_problema'].includes(estado)) {
                return `${basePath}enEsperaValidacion`;
            } else if (estado === 'rechazado') {
                return `${basePath}countrechazados`;
            } else if (estado === 'finalizado') {
                return `${basePath}countFinalizado`;
            } else if (['finalizado', 'finalizado_con_problema', 'finalizado_sin_problema'].includes(estado)) {
                return `${basePath}countprocesoFinalizado`;
            }
        
            return basePath; 
        };
        
        const emisorId = dataAfter.emisor.id;

        if (!dataBefore) {
            console.log(`Documento nuevo detectado con ID: ${event.params.docId}`);
            
            await processCounter(dataAfter.estado, emisorId, 1);
            
            const rutaDoc = getDocumentFolderPath(dataAfter.estado, emisorId);
            const repo = new FirestoreRepository<Documento>(rutaDoc);
            repo.addDocumentById(event.params.docId, dataAfter);

        } else if (dataBefore.estado !== dataAfter.estado) {
            console.log(`Cambio de estado detectado en documento ID: ${event.params.docId}. De "${dataBefore.estado}" a "${dataAfter.estado}"`);
            
            await processCounter(dataBefore.estado, emisorId, -1);
            await processCounter(dataAfter.estado, emisorId, 1);

            const oldRutaDoc = getDocumentFolderPath(dataBefore.estado, emisorId);
            const oldRepo = new FirestoreRepository<Documento>(oldRutaDoc);
            oldRepo.deleteDocument(event.params.docId);

            const newRutaDoc = getDocumentFolderPath(dataAfter.estado, emisorId);
            const newRepo = new FirestoreRepository<Documento>(newRutaDoc);
            newRepo.addDocumentById(event.params.docId, dataAfter);
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