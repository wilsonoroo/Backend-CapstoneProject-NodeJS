import { firestore } from 'firebase-admin';
import { Documento } from '../../core/models';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { incrementCounterBy, initCounter } from './contadorDistribuido';

/**
 * Cloud function que se activa cada vez que un documento es escrito en la colección "documentos".
 * 
 * Esta función tiene el objetivo de:
 * 1. Incrementar un contador distribuido específico para un estado cuando un nuevo documento es creado.
 * 2. Ajustar los contadores distribuidos cuando un documento cambia de estado. 
 *    Esto implica decrementar el contador del estado anterior y incrementar el contador del nuevo estado.
 * 
 * @param event - Evento asociado con el cambio de documento en Firestore.
 */

export const myfunctionk = onDocumentWritten("documentos/{docId}", async(event) => {
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

        const getRootPath = (estado: string) => `contadores/count_${estado}`;

        // Si el documento es nuevo
        if (!dataBefore) {
            console.log(`Documento nuevo detectado con ID: ${event.params.docId}`);
            const rootPath = getRootPath(dataAfter.estado);
            const shardsCollectionRef = db.collection(`${rootPath}/shards`);
            const snapshotCounter = await shardsCollectionRef.limit(1).get();

            if (snapshotCounter.empty) {
                console.log(`Inicializando contador para el estado: ${dataAfter.estado}`);
                await initCounter(db, rootPath, numShards);
            }

            await incrementCounterBy(db, rootPath, numShards, 1);
            console.log(`Incrementado contador para el estado: ${dataAfter.estado}`);

        } else if (dataBefore.estado !== dataAfter.estado) { 
            console.log(`Cambio de estado detectado en documento ID: ${event.params.docId}. De "${dataBefore.estado}" a "${dataAfter.estado}"`);

            // Decrementar el contador del estado anterior
            const rootPathBefore = getRootPath(dataBefore.estado);
            const shardsCollectionRefBefore = db.collection(`${rootPathBefore}/shards`);
            const snapshotCounterBefore = await shardsCollectionRefBefore.limit(1).get();

            if (snapshotCounterBefore.empty) {
                console.log(`Inicializando contador para el estado: ${dataBefore.estado}`);
                await initCounter(db, rootPathBefore, numShards);
            }

            await incrementCounterBy(db, rootPathBefore, numShards, -1);
            console.log(`Decrementado contador para el estado anterior: ${dataBefore.estado}`);

            // Incrementar el contador del nuevo estado
            const rootPathAfter = getRootPath(dataAfter.estado);
            const shardsCollectionRefAfter = db.collection(`${rootPathAfter}/shards`);
            const snapshotCounterAfter = await shardsCollectionRefAfter.limit(1).get();

            if (snapshotCounterAfter.empty) {
                console.log(`Inicializando contador para el estado: ${dataAfter.estado}`);
                await initCounter(db, rootPathAfter, numShards);
            }

            await incrementCounterBy(db, rootPathAfter, numShards, 1);
            console.log(`Incrementado contador para el nuevo estado: ${dataAfter.estado}`);

        }
    } catch (error) {
        console.error(`Error al procesar el documento ID: ${event.params.docId}. Detalle del error:`, error);
    }
});
