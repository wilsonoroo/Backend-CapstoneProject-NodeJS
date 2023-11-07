
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import {Documento} from '../../core/models';
import {
    onDocumentWritten,
  } from "firebase-functions/v2/firestore";

import { todosHanFirmado } from '../../core/utils/verificadorDeFirma/verificador';  
import NotificationService from '../../core/services/notificacion/notificacionFCM';
import { getUserTokensFromMap } from '../../core/utils/getTokens';

const notificationService = new NotificationService();


export const escuchando = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentosRespaldo/{docId}", async(event) => {    
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }

    const docId = event.params.docId;
    const dataBefore = snapshot.before.data() as Documento;
    const dataAfter = snapshot.after.data() as Documento;

    // Verificar si el documento ha cambiado realmente
    if (JSON.stringify(dataBefore) === JSON.stringify(dataAfter)) {
        return; // No hacer nada si el documento no ha cambiado
    }

    const repo = new FirestoreRepository<Documento>(`empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosRespaldo`); 
    const newRepo = new FirestoreRepository<Documento>(`empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentos`); 
    // Verifica si la abreviatura del documento es "is"
    if (dataAfter.checklist && dataAfter.checklist.abreviatura === "IS") {
        console.log("El dumento es tipo IS")
        if (dataAfter.cuadrilla && todosHanFirmado(dataAfter)) {
            console.log("Todos firmaron el documento")
            // verifica si todos han firmado en la cuadrilla
            if (dataAfter.estado == "generado") {                
                // 1. Cambiar el estado del documento a "pendiente_validar"
                // await repo.updateDocument(docId, {estado: "pendiente_validar"} );
                // 2. Mover el documento a una nueva ruta    
                dataAfter.estado = "pendiente_validar";             
                await newRepo.addDocumentById(docId, dataAfter);
                // 3. Eliminar el documento de la ruta actual
                await repo.deleteDocument(docId);
                // Recuperamos los tokens de los validadores.
                const validadoresTokens = await getUserTokensFromMap(dataAfter.cuadrilla.validadores);

                if (validadoresTokens.length > 0) {
                    // Definimos el mensaje de la notificación.
                    const message = {
                        title: "Acción requerida",
                        body: "Debes firmar el documento IS pendiente de validación."
                    };

                    // Enviamos la notificación a todos los tokens recuperados.
                    const response = await notificationService.sendNotificationMulticast(validadoresTokens, message);

                    // Si la notificación se envió correctamente...
                    if (response.success) {
                        console.log("Notificación enviada exitosamente");
                    } else {
                        console.error("Error enviando notificación:", response.error);
                    }
                } else {
                    console.log("No se encontraron tokens de validadores para enviar notificaciones");
                }

            } else {
                console.log("Todos han firmado, pero el documento no está en el estado 'generado'.");
            }
            
        } else if (dataAfter.cuadrilla && !todosHanFirmado(dataAfter)) {
            console.log("Faltan firmas en la cuadrilla.");
            // if (!snapshot.before.exists) {
            //     console.log("El documento ha sido creado recientemente. Notificando a los usuarios para validación.");

            // }else{
            //     console.log("El documento ya existía y todavía le faltan firmas.");
            // }
        }
    }else {
        console.log("El documento no es IS")        
    }
});

