import { firestore } from 'firebase-admin';
import { Documento } from '../../core/models';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { incrementCounterBy, initCounter } from './contadorDistribuido';

export const myfunctionk = onDocumentWritten("documentos/{docId}", async(event) => {
    const snapshot = event.data;
    
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }

    const docId = event.params.docId;
    const dataBefore = snapshot.before.data() as Documento | undefined; // Puede ser undefined si es un nuevo documento
    const dataAfter = snapshot.after.data() as Documento;

    console.log(docId);
    console.log(dataBefore);
    console.log(dataAfter);

    // Verificamos si es una creación de un nuevo documento y no una actualización
    if (!dataBefore) {
        // Iniciar o incrementar el contador distribuido
        const db = firestore(); // Asegúrate de inicializar la instancia de Firestore adecuadamente.
        const rootPath = "documentos/contador";
        const numShards = 10;  // Puedes ajustar esto según lo necesites

        // Verificar si el contador ya ha sido inicializado
        const shardsCollectionRef = db.collection(`${rootPath}/shards`);
        const snapshotCounter = await shardsCollectionRef.limit(1).get();

        // Si el contador no ha sido inicializado, inicializarlo
        if (snapshotCounter.empty) {
            await initCounter(db, rootPath, numShards);
        }

        // Incrementar el contador en 1
        await incrementCounterBy(db, rootPath, numShards, 1);
    }
});