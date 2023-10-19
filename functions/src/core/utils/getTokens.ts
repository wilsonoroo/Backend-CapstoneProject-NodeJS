import * as admin from 'firebase-admin';
/**
 * Función que recupera los tokens de los usuarios a partir de un mapa.
 * 
 * @param userMap - Mapa que contiene las IDs de los usuarios (ya sean validadores o integrantes de una cuadrilla).
 * @returns {Promise<string[]>} - Retorna una promesa que se resuelve con un arreglo de tokens.
 */
export async function getUserTokensFromMap(userMap: any): Promise<string[]> {
    const db = admin.firestore(); // Inicializamos la instancia de Firestore.
    const tokens: string[] = [];  // Arreglo para almacenar los tokens recuperados.

    // Iteramos a través de las IDs de los usuarios.
    for (const userId of Object.keys(userMap)) {
        // Intentamos obtener el documento del usuario en la colección 'auth'.
        const userSnapshot = await db.collection('auth').doc(userId).get();

        // Si el documento existe...
        if (userSnapshot.exists) {
            // Recuperamos los dispositivos asociados al usuario.
            const dispositivosSnapshot = await db.collection(`auth/${userId}/dispositivos`).get();

            const userTokens: string[] = []; // Arreglo para almacenar temporalmente los tokens de este usuario.

            // Añadimos cada token al arreglo de tokens.
            dispositivosSnapshot.forEach(doc => {
                const token = doc.data().token;
                tokens.push(token);
                userTokens.push(token); // Agregamos el token al arreglo temporal.
            });

            // Mostramos por consola el ID del usuario y sus tokens.
            console.log(`Usuario ID: ${userId}, Tokens: `, userTokens);
        }
    }
    return tokens; // Retornamos los tokens recuperados.
}
