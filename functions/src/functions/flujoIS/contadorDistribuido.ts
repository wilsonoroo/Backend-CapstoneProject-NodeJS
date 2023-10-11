import { firestore } from 'firebase-admin'; // Asegúrate de tener esta dependencia



export async function initCounter(db: firestore.Firestore, rootPath: string, numShards = 10) {
    const shardsCollectionRef = db.collection(`${rootPath}/shards`);
    const snapshot = await shardsCollectionRef.limit(1).get();
    
    // Si no existen fragmentos, inicialízalos
    if (snapshot.empty) {
        const batch = db.batch();
    
        // Inicializar cada fragmento
        for (let i = 0; i < numShards; i++) {
            const shardRef = db.doc(`${rootPath}/shards/${i}`);
            batch.set(shardRef, { count: 0 });
        }
    
        await batch.commit();
    }
}

export async function incrementCounterBy(db: firestore.Firestore, rootPath: string, numShards: number, value: number) {
    const shardId = Math.floor(Math.random() * numShards);
    const shardRef = db.doc(`${rootPath}/shards/${shardId}`);

    return db.runTransaction(async (transaction) => {
        const shardDoc = await transaction.get(shardRef);
        const currentCount = shardDoc.get('count') || 0;
        transaction.update(shardRef, { count: currentCount + value });
    });
}

export async function getCounterValue(db: firestore.Firestore, rootPath: string) {
    const shardsColl = db.collection(`${rootPath}/shards`);
    const shardDocs = await shardsColl.get();

    let totalCount = 0;
    shardDocs.forEach(doc => {
        totalCount += doc.get('count') || 0;
    });

    return totalCount;
}
