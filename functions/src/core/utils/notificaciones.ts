import * as admin from 'firebase-admin';

export class Notificaciones {
  static sendNotificacionMulticast(
    tokens: any[],
    msj: { title: string; body: string }
  ) {
    try {
      const payload = {
        tokens: tokens,
        notification: msj,
        data: {
          // TODO: posiblemente se deba enviar información a futuro
          body: 'message',
        },
      };

      console.log(JSON.stringify(tokens));

      admin
        .messaging()
        .sendMulticast(payload)
        .then((response) => {
          console.log('Mensaje enviado correctamente: ', response);
          return { success: true };
        })
        .catch((error) => {
          return { error: error.code };
        });
    } catch (error) {
      console.error(error);
    }
  }
}
