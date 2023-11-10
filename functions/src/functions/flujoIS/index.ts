// // import * as functions from 'firebase-functions';
// // import {Request, Response} from 'firebase-functions';
// import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
// import {Documento} from '../../core/models';
// import {
//     onDocumentWritten,
//     // Change,
//     // FirestoreEvent,
//     // onDocumentCreated
//   } from "firebase-functions/v2/firestore";

// import { todosHanFirmado } from '../../core/utils/verificadorDeFirma/verificador';  
// import NotificationService from '../../core/services/notificacion/notificacionFCM';
// // import { logger } from 'firebase-functions/v2';

// const notificationService = new NotificationService();


// export const myfunction = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentos/{docId}", async(event) => {    
//     const snapshot = event.data;
//     if (!snapshot) {
//         console.log("No data associated with the event");
//         return;
//     }

//     const docId = event.params.docId;
//     const dataBefore = snapshot.before.data() as Documento;
//     const dataAfter = snapshot.after.data() as Documento;

//     console.log(docId);
//     console.log(dataBefore);
//     console.log(dataAfter);

//     const repo = new FirestoreRepository<Documento>(`empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentos`); 

//     // Verifica si la abreviatura del documento es "is"
//     if (dataAfter.checklist && dataAfter.checklist.abreviatura === "IS") {
//         console.log("El dumento es tipo IS")
//         if (dataAfter.cuadrilla && todosHanFirmado(dataAfter)) {
//             console.log("Todos firmaron el documento")
//             // verifica si todos han firmado en la cuadrilla
//             if (dataAfter.estado == "generado") {
//                 // Si todos han firmado y el documento está en estado "generado"
//                 repo.updateDocument(docId, {estado: "pendiente_validar"} );
//                 const tokens = Object.values(dataAfter.cuadrilla.validadores).map(validador => validador.token);
//                 const mensaje = {
//                     title: 'Validación requerida',
//                     body: 'Debes firmar el documento IS.'
//                 };

//                 // logger.debug()
//                 console.log("Tokens a los que se enviará la notificación:", tokens);
//                 console.log("Mensaje de notificación:", mensaje);

//                 await notificationService.sendNotificationMulticast(tokens, mensaje);            

//             } else {
//                 console.log("Todos han firmado, pero el documento no está en el estado 'generado'.");
//             }
            
//         } else if (dataAfter.cuadrilla && !todosHanFirmado(dataAfter)) {
//             console.log("Faltan firmas en la cuadrilla.");
//         }
//         if (dataAfter.estado === "validado") {
//             console.log("El documento ha sido validado.");
//             repo.updateDocument(docId, {estado: "finalizado"} );
//         }

//         if (dataAfter.estado === "rechazado") {
//             console.log("El documento ha sido rechazado.");
//         }
//     }else {
//         console.log("El documento no es IS")        
//     }
// });