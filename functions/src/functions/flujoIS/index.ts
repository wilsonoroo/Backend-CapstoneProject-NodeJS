// import * as functions from 'firebase-functions';
// import {Request, Response} from 'firebase-functions';
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import {Documento} from '../../core/models';
import {
    onDocumentWritten,
    // Change,
    // FirestoreEvent,
    // onDocumentCreated
  } from "firebase-functions/v2/firestore";

import { todosHanFirmado } from './verificador';  
import NotificationService from './notificacionFCM';



const notificationService = new NotificationService();


export const myfunction = onDocumentWritten("documentos/{docId}", async(event) => {    
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const docId = event.params.docId;
    const dataBefore = snapshot.before.data() as Documento;
    const dataAfter = snapshot.after.data() as Documento;

    console.log(docId)
    console.log(dataBefore);
    console.log(dataAfter)

    const repo = new FirestoreRepository<Documento>('documentos'); 

    if (dataAfter.cuadrilla && todosHanFirmado(dataAfter)) {
        // Aquí es donde verificas si todos han firmado en la cuadrilla

        if (dataAfter.estado == "generado") {
            // Si todos han firmado y el documento está en estado "generado"
            
            repo.updateDocument(docId, {estado: "pendiente_validar"} )
            // Extraemos los tokens de los validadores desde el mapa dentro de cuadrilla.
            const tokens = Object.values(dataAfter.cuadrilla.validadores).map(validador => validador.token);
            const mensaje = {
                title: 'Validación requerida',
                body: 'Debes firmar el documento IS.'
            };

            console.log("Tokens a los que se enviará la notificación:", tokens);  // Visualizar tokens
            console.log("Mensaje de notificación:", mensaje);  // Visualizar mensaje

            
            await notificationService.sendNotificationMulticast(tokens, mensaje);
            //SUBIR EL DOCUMENTO

            
        } else {
            // Si todos han firmado, pero el documento NO está en estado "generado"
            console.log("Todos han firmado, pero el documento no está en el estado 'generado'.");
        }
        
    } else if (dataAfter.cuadrilla && !todosHanFirmado(dataAfter)) {
        // Aquí es donde verificas si NO todos han firmado en la cuadrilla
        console.log("Faltan firmas en la cuadrilla.");

    } if (dataAfter.estado === "validado") {
        console.log("El documento ha sido validado.");
        repo.updateDocument(docId, {estado: "finalizado"} )
        

    } if (dataAfter.estado === "rechazado") {
        console.log("El documento ha sido rechazado.");

    }
});
