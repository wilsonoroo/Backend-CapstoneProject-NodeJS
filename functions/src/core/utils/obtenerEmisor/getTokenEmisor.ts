import * as admin from 'firebase-admin';
import { getIDforDisplayName } from './obtenerID';


// Esta es tu función getUserTokensFromMap modificada para obtener los tokens basados en displayName
export async function getUserTokensFromDisplayName(displayName: string): Promise<string[]> {
  const db = admin.firestore(); // Inicializamos la instancia de Firestore.
  const tokens: string[] = [];  // Arreglo para almacenar los tokens recuperados.

  // Primero obtenemos el ID del usuario basado en su displayName
  const userId = await getIDforDisplayName(displayName);

  // Verificamos si se obtuvo un ID
  if (userId) {
    // Intentamos obtener el documento del usuario en la colección 'auth'.
    const userSnapshot = await db.collection('auth').doc(userId).get();

    // Si el documento existe...
    if (userSnapshot.exists) {
        // Recuperamos los dispositivos asociados al usuario.
        const dispositivosSnapshot = await db.collection(`auth/${userId}/dispositivos`).get();

        // Añadimos cada token al arreglo de tokens.
        dispositivosSnapshot.forEach(doc => {
            const token = doc.data().token;
            tokens.push(token); // Agregamos el token al arreglo de tokens.
        });

        // Mostramos por consola el ID del usuario y sus tokens.
        console.log(`Usuario ID: ${userId}, Tokens: `, tokens);
    } else {
        console.log('No se encontró un usuario con ese displayName');
    }
  } else {
    console.log('No se encontró un ID para el displayName proporcionado');
  }

  return tokens; // Retornamos los tokens recuperados.
}