import * as admin from 'firebase-admin';

interface NotificationMessage {
    title: string;
    body: string;
}

interface NotificationResponse {
    success?: boolean;
    error?: string;
}


export default class NotificationService {

    async sendNotificationMulticast(tokens: string[], mensaje: NotificationMessage): Promise<NotificationResponse> {
        if (!tokens.length) {
            console.error("No tokens provided");
            return { error: "No tokens provided" };
        }
    
        // Creamos un array de mensajes individualmente para cada token
        const messages = {
            tokens,
            notification: mensaje,
            data: {
                body: "message",
            },
        };
    
        
        try {
            const response = await admin.messaging().sendMulticast(messages);
            console.log("Mensaje enviado correctamente: ", response);
            return { success: true };
    
        } catch (error: any) {
            console.error("Failed to send notification:", error);
            const errorMessage = error.code ? error.code : error.message;
            return { error: errorMessage };
        }
    }
    
}
