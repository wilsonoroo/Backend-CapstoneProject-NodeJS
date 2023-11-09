import { FirestoreRepository } from '../../services';
import { Dispositivo,  } from '../../models';


export async function getUserTokensFromDisplayName(userId: string): Promise<string[]> {
  const repo = new FirestoreRepository('auth');
  const tokens: string[] = [];

  try {
    // Obtén el documento del usuario
    const userDocument = await repo.getDocument(userId);
    console.log('el userDocument es :', userDocument);

    if (userDocument) {
      // Obtén los dispositivos asociados al usuario
      repo.setReference(`auth/${userId}/dispositivos`);
      const dispositivos = (await repo.getAlldocuments()) as Dispositivo[];
      dispositivos.forEach((device) => {
        tokens.push(device.token);
      });
      console.log(`Usuario ID: ${userId}, Tokens: `, tokens);
    } else {
      console.log('No se encontró un usuario con ese ID');
    }
  } catch (error) {
    console.error('Error al obtener tokens:', error);
  }

  return tokens;
}