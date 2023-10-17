import {Documento,} from '../../core/models'
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import NotificationService from '../../core/services/notificacion/notificacionFCM';
import { plainToClass } from "class-transformer";


const tokens = ["cr2ZLWDhThGW3XfXwWj3HG:APA91bETvBGlmZPgca1coBw220HbjrBG1FXdTwF2h33rDQ_NUQORU4OLu_CbtRcNNutT_XVFB7y2QxPFOG64odgtS_uDXq4nxPHhsjCPIMia2VcZOgjGmpRXfNStbJ0Eg7aJd-zoStoQ"];


//Flujo de Generar Documento 
export const GenerarDocumento = onDocumentCreated("/empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    //obtener datos y transformarlo a Documento
    const data = event.data?.data();
    const doc = plainToClass(Documento, data as Object);
    
    const notificationService = new NotificationService();

    const needValidacion = doc.needValidacion();
    const needPlanDeAccion = doc.needPlanDeAccion(); 
    const conProblemas = doc.DocumentoConProblemas();

    if(!needValidacion){
        doc.pdf =EnkiCreator.generarPDF(doc)
        // let pdf = await EnkiCreator.generarPDF(doc);
        // doc.pdf = await Storage.Savefile(pdf);
        console.log("EL DOCUMENTO FUE VALIDADO");                    
        const mensaje = {
            title: 'AVISO',
            body: 'El documento fue validado'
        };
        await notificationService.sendNotificationMulticast(tokens, mensaje);

        if(needPlanDeAccion){
            repo.updateDocument(doc.id, {estado: "finalizado_con_plan_accion"} );
        }
        else{
            repo.updateDocument(doc.id, {estado: "finalizado"} );
        }
    }else{
        if(conProblemas){
            repo.updateDocument(doc.id, {estado: "doc_con_problemas"} );
            console.log("DOCUMENTO CON PROBLEMAS");                    
            const mensaje = {
                title: 'AVISO',
                body: 'El documento tiene problema'
            };
            await notificationService.sendNotificationMulticast(tokens, mensaje);
    
        }
        else if(!conProblemas){
            repo.updateDocument(doc.id, {estado: "doc_sin_problemas"} );
            console.log("DOCUMENTO SIN PROBLEMAS");                    
            const mensaje = {
                title: 'AVISO',
                body: 'El documento sin problemas'
            };
            await notificationService.sendNotificationMulticast(tokens, mensaje);
        }
    }

});