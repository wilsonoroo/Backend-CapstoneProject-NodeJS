import * as admin from 'firebase-admin';

export async function getIDforDisplayName(displayName: string): Promise<string|null> {
  const db = admin.firestore();

  try {
    const snapshot = await db.collection('auth') 
      .where('displayName', '==', displayName)
      .get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    let id = null; // Esto mantendrá el id si se encuentra un documento
    snapshot.forEach(doc => {
      id = doc.id; 
    });

    return id;
  } catch (error) {
    console.error('Error al obtener documento: ', error);
    throw error;
  }
}