import * as functions from 'firebase-functions';
import {Request, Response} from 'firebase-functions';
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import {Documento} from '../../core/models';


import { todosHanFirmado } from './verificador';  
import NotificationService from './notificacionFCM';

export const id = "doc";

export const flujo = functions.https.onRequest(async (request: Request, response: Response) => {
    
    const repo = new FirestoreRepository<Documento>('documentos');   
    const doc = await repo.getDocument<Documento>(id);

    
    if (doc.cuadrilla && todosHanFirmado(doc.cuadrilla)) {
        if ( doc.estado == "generado" ){
            console.log("NOTIFICAR A LOS VALIDADORES QUE DEBEN FIRMAR LA IS ")
            repo.updateDocument(id, {estado: "pendiente_validar"} )
        }        
        response.send("Todos los trabajadores han firmado.");
        console.log(doc.cuadrilla)
    } else if ( doc.estado === "validado") {

        repo.updateDocument(id, {estado: "validado"} )

    } else if ( doc.estado === "rechazado" ) {

        repo.updateDocument(id, {estado: "rechazado"} )

    } else {        
        console.log("NOTIFICAR A LOS USUARIOS DEL DOCUMENTO QUE DEBEN FIRMAR.");
        response.send("No todos los trabajadores han firmado.");
    }
   

});


export const flujo1 = functions.firestore
    .document('documentos/{id}')
    .onCreate(async (snapshot, context) => {
        // Obtiene los datos del documento desde el snapshot
        const docData = snapshot.data() as Documento;
        // Obtiene el ID del documento desde el contexto
        const docId = context.params.id;
        const repo = new FirestoreRepository<Documento>('documentos'); 

        if (docData.cuadrilla && todosHanFirmado(docData.cuadrilla)) {
            if ( docData.estado == "generado" ){
                console.log("CUADRILLA DEL DOC : ", docData.cuadrilla)
                console.log("NOTIFICAR A LOS VALIDADORES QUE DEBEN FIRMAR LA IS  ")
                repo.updateDocument(docId, {estado: "pendiente_validar"} )
            }        
            // response.send("Todos los trabajadores han firmado.");
            console.log(docData.cuadrilla)
        } else if ( docData.isAutoValidado === true) {

            repo.updateDocument(docId, {estado: "validado"} )

        } else if (docData.isAutoValidado === false) {

            repo.updateDocument(docId, {estado: "rechazado"} )

        } else {        
            console.log("NOTIFICAR A LOS USUARIOS DEL DOCUMENTO QUE DEBEN FIRMAR.");
            // response.send("No todos los trabajadores han firmado.");
        }



        // Imprime el ID del documento
        console.log("ID del documento:", docId);
        // Imprime todos los datos del documento
        console.log("Datos del documento:", docData);
    });

       
// export const flujo2 = functions.firestore
//     .document('documentos/{id}')
//     .onCreate(async (snapshot, context) => {
//         // Obtiene los datos del documento desde el snapshot        
//         const docData = snapshot.data() as Documento;
//         const docId = context.params.id;
//     });


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