import * as functions from 'firebase-functions';
import {Request, Response} from 'firebase-functions';
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import {Documento} from '../../core/models';
import {
    onDocumentWritten,
    // Change,
    // FirestoreEvent,
    // onDocumentCreated
  } from "firebase-functions/v2/firestore";
// type DocumentSnapshot = functions.firestore.DocumentSnapshot;

import { todosHanFirmado } from './verificador';  
import NotificationService from './notificacionFCM';
// import { DistributedCounter } from './contadorDistribuido';

export const id = "doc";




const notificationService = new NotificationService();

export const flujo3 = functions.https.onRequest(async (request: Request, response: Response) => {
    
    const repo = new FirestoreRepository<Documento>('documentos');   
    const doc = await repo.getDocument<Documento>(id);

    if (doc.cuadrilla && todosHanFirmado(doc.cuadrilla)) {
        if ( doc.estado == "generado" ) {
            console.log("NOTIFICAR A LOS VALIDADORES QUE DEBEN FIRMAR LA IS ");

            // Extraemos los tokens de los validadores desde el mapa dentro de cuadrilla.
            const tokens = Object.values(doc.cuadrilla.validadores).map(validador => validador.codigo);
            
            
            const mensaje = {
                title: 'Validación requerida',
                body: 'Debes firmar el documento IS.'
            };

            console.log("Tokens a los que se enviará la notificación:", tokens);  // Visualizar tokens
            console.log("Mensaje de notificación:", mensaje);  // Visualizar mensaje

            
            await notificationService.sendNotificationMulticast(tokens, mensaje);

            repo.updateDocument(id, {estado: "pendiente_validar"});
        }
        
        response.send("Todos los trabajadores han firmado.");
    } else if ( doc.estado === "validado") {
        repo.updateDocument(id, {estado: "validado"});
    } else if ( doc.estado === "rechazado" ) {
        repo.updateDocument(id, {estado: "rechazado"});
    } else {
        console.log("NOTIFICAR A LOS USUARIOS DEL DOCUMENTO QUE DEBEN FIRMAR.");
        // Aquí también agregar lógica para notificar 
        response.send("No todos los trabajadores han firmado.");
    }
});



export const myfunction1 = onDocumentWritten("documentos/{docId}", async(event) => {    
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

    if (dataAfter.cuadrilla && todosHanFirmado(dataAfter.cuadrilla)) {
        if ( dataAfter.estado == "generado" ){
         
            repo.updateDocument(docId, {estado: "pendiente_validar"} )
            // Extraemos los tokens de los validadores desde el mapa dentro de cuadrilla.
            const tokens = Object.values(dataAfter.cuadrilla.validadores).map(validador => validador.codigo);
            const mensaje = {
                title: 'Validación requerida',
                body: 'Debes firmar el documento IS.'
            };

            console.log("Tokens a los que se enviará la notificación:", tokens);  // Visualizar tokens
            console.log("Mensaje de notificación:", mensaje);  // Visualizar mensaje

            
            await notificationService.sendNotificationMulticast(tokens, mensaje);

            //SUBIR DOCUMENTOS A ENTIDAD DOCUMENTOS

        }
    } else if ( dataAfter.estado === "validado") {
        console.log("CAMBIA FINALIZADO")
        // repo.updateDocument(docId, {estado: "finalizado"} )
        // GENERAR DOCUMENTO PDF CON ESTADO FINALIZADO
        // NOTIFICAR A LOS USUARIOS

    } else if (dataAfter.estado === "rechazado") {
        console.log("sigue rechazado")
        // GENERAR DOCUMENTO PDF CON ESTADO RECHAZADO
        // NOTIFICAR A LOS USUARIOS

    } else {        
        // console.log("NOTIFICAR A LOS USUARIOS DEL DOCUMENTO QUE DEBEN FIRMAR.");
        // response.send("No todos los trabajadores han firmado.");
    }
    
});



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

    if (dataAfter.cuadrilla && todosHanFirmado(dataAfter.cuadrilla)) {
        // Aquí es donde verificas si todos han firmado en la cuadrilla

        if (dataAfter.estado == "generado") {
            // Si todos han firmado y el documento está en estado "generado"
            
            repo.updateDocument(docId, {estado: "pendiente_validar"} )
            // Extraemos los tokens de los validadores desde el mapa dentro de cuadrilla.
            const tokens = Object.values(dataAfter.cuadrilla.validadores).map(validador => validador.codigo);
            const mensaje = {
                title: 'Validación requerida',
                body: 'Debes firmar el documento IS.'
            };

            console.log("Tokens a los que se enviará la notificación:", tokens);  // Visualizar tokens
            console.log("Mensaje de notificación:", mensaje);  // Visualizar mensaje

            
            await notificationService.sendNotificationMulticast(tokens, mensaje);
            

            
        } else {
            // Si todos han firmado, pero el documento NO está en estado "generado"
            console.log("Todos han firmado, pero el documento no está en el estado 'generado'.");
        }
        
    } else if (dataAfter.cuadrilla && !todosHanFirmado(dataAfter.cuadrilla)) {
        // Aquí es donde verificas si NO todos han firmado en la cuadrilla
        console.log("Faltan firmas en la cuadrilla.");

    } if (dataAfter.estado === "validado") {
        console.log("El documento ha sido validado.");
        repo.updateDocument(docId, {estado: "finalizado"} )
        

    } if (dataAfter.estado === "rechazado") {
        console.log("El documento ha sido rechazado.");

    }
});
