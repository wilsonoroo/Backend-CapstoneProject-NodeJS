import { firestore } from 'firebase-admin';

/**
 * Inicializa los fragmentos del contador distribuido.
 * @param db - Instancia de Firestore.
 * @param rootPath - Ruta raíz del contador distribuido.
 * @param numShards - Número de fragmentos para el contador.
 */
export async function initCounter(db: firestore.Firestore, rootPath: string, numShards = 10) {
    const shardsCollectionRef = db.collection(`${rootPath}/shards`);
    const snapshot = await shardsCollectionRef.limit(1).get();
    
    // Verificar si ya existen fragmentos para este contador.
    if (snapshot.empty) {
        const batch = db.batch();
    
        // Inicializar cada fragmento con un conteo de 0.
        for (let i = 0; i < numShards; i++) {
            const shardRef = db.doc(`${rootPath}/shards/${i}`);
            batch.set(shardRef, { count: 0 });
        }
    
        await batch.commit();
    }
}

/**
 * Incrementa el valor del contador distribuido.
 * @param db - Instancia de Firestore.
 * @param rootPath - Ruta raíz del contador distribuido.
 * @param numShards - Número de fragmentos para el contador.
 * @param value - Valor para incrementar.
 */
export async function incrementCounterBy(db: firestore.Firestore, rootPath: string, numShards: number, value: number) {
    const shardId = Math.floor(Math.random() * numShards);
    const shardRef = db.doc(`${rootPath}/shards/${shardId}`);

    return db.runTransaction(async (transaction) => {
        const shardDoc = await transaction.get(shardRef);
        const currentCount = shardDoc.get('count') || 0;
        transaction.update(shardRef, { count: currentCount + value });
    });
}

/**
 * Obtiene el valor actual del contador distribuido sumando todos los fragmentos.
 * @param db - Instancia de Firestore.
 * @param rootPath - Ruta raíz del contador distribuido.
 */
export async function getCounterValue(db: firestore.Firestore, rootPath: string) {
    const shardsColl = db.collection(`${rootPath}/shards`);
    const shardDocs = await shardsColl.get();

    let totalCount = 0;
    shardDocs.forEach(doc => {
        totalCount += doc.get('count') || 0;
    });

    return totalCount;
}