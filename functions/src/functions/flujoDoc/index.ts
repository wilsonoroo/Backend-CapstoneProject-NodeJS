import {Documento,} from '../../core/models'
import {convertDocumentTimestampsToDate} from '../../core/utils/';
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import NotificationService from '../../core/services/notificacion/notificacionFCM';
import { plainToClass } from "class-transformer";
import { Storage } from '../../core/services/storage/storage';
import * as fs from 'fs';


const pdfData = fs.readFileSync('Rendicion_Numero_1.pdf');

//Flujo de Generar Documento 
export const GenerarDocumento = onDocumentCreated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {
    const rutaDoc = `empresas/${event.params.nombreEmpresa}/gerencias/${event.params.nombreGerencia}/divisiones/${event.params.nombreDivision}/documentos`;
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    //obtener datos y transformarlo a Documento
    const data = event.data?.data();
    console.log("data:", data?.fechaCreacion);
    const transformedData = convertDocumentTimestampsToDate(data);
    const doc = plainToClass(Documento, transformedData);
    console.log("doc:", doc);
    const notificationService = new NotificationService();
    const needValidacion = doc.needValidacion();
    const needPlanDeAccion = doc.needPlanDeAccion(); 
    const conProblemas = doc.DocumentoConProblemas();
    const empresa =  event.params.nombreEmpresa;
    // Revision si hay cuadrilla y validadores  
    // if (!doc.cuadrilla || !doc.cuadrilla.validadores) {
    //     console.log("No hay validadores en la cuadrilla");
    //     return;
    // }
    // const tokens = Object.values(doc.cuadrilla?.validadores).map(validador => validador.token);
    const tokens = ["cr2ZLWDhThGW3XfXwWj3HG:APA91bETvBGlmZPgca1coBw220HbjrBG1FXdTwF2h33rDQ_NUQORU4OLu_CbtRcNNutT_XVFB7y2QxPFOG64odgtS_uDXq4nxPHhsjCPIMia2VcZOgjGmpRXfNStbJ0Eg7aJd-zoStoQ"];



    if(!needValidacion){
        const pdf =EnkiCreator.generarPDF(doc)
        console.log(" pdf:", pdf)
        doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento
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