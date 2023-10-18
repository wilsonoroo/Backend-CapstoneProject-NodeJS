
import {Documento,} from '../../core/models';
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { Storage } from '../../core/services/storage/storage';
import { onDocumentUpdated,  } from "firebase-functions/v2/firestore";
// import {onRequest} from 'firebase-functions/v2/https';
// import {Request, Response} from 'firebase-functions';
import NotificationService from '../../core/services/notificacion/notificacionFCM';
import { plainToClass } from "class-transformer";
import * as fs from 'fs';
import {convertDocumentTimestampsToDate} from '../../core/utils/';
import { logger } from 'firebase-functions/v2';

const pdfData = fs.readFileSync('Rendicion_Numero_1.pdf');

//Flujo de actualizacion de documentos
export const FlujoActualizarPDF = onDocumentUpdated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event) => {
    const rutaDoc = `empresas/${event.params.nombreEmpresa}/gerencias/${event.params.nombreGerencia}/divisiones/${event.params.nombreDivision}/documentos`;
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    //obtener datos y transformarlo a Documento
    const data = event.data?.after.data();
    const transformedData = convertDocumentTimestampsToDate(data);
    const doc = plainToClass(Documento, transformedData);
    logger.log("doc:", doc.id);
    //obtener datos anteriores y transformarlo a Documento
    const dataAnterior = event.data?.before.data();
    const transformedData2 = convertDocumentTimestampsToDate(dataAnterior);
    const docAnterior = plainToClass(Documento, transformedData2);
    console.log("doc:", docAnterior.id);
    const notificationService = new NotificationService();
    const estadoActual = doc.estado;
    const isPlanDeAccion = doc.isPlanDeAccion;
    const needPlandeAccion = doc.needPlanDeAccion();
    const estadoAnterior =  docAnterior.estado;
    const empresa =  event.params.nombreEmpresa;

    // // Revision si hay cuadrilla y validadores  
    // if (!doc.cuadrilla || !doc.cuadrilla.validadores) {
    //     console.log("No hay validadores en la cuadrilla");
    //     return;
    // }
    // const tokens = Object.values(doc.cuadrilla?.validadores).map(validador => validador.codigo);
    const tokens = ["cr2ZLWDhThGW3XfXwWj3HG:APA91bETvBGlmZPgca1coBw220HbjrBG1FXdTwF2h33rDQ_NUQORU4OLu_CbtRcNNutT_XVFB7y2QxPFOG64odgtS_uDXq4nxPHhsjCPIMia2VcZOgjGmpRXfNStbJ0Eg7aJd-zoStoQ"];


    if (estadoActual == "finalizado" || estadoActual  == "validado") {
        if(estadoAnterior === "doc_con_problemas"||estadoAnterior === "doc_sin_problemas"){
            const pdf =EnkiCreator.generarPDF(doc)
            console.log(" pdf:", pdf)
            doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento
            //transformar a JSON el documento.pdf   
            const jsonPDF = JSON.parse(JSON.stringify(doc.pdf))
            console.log("pdf",jsonPDF)
            repo.updateDocument(doc.id, {pdf:jsonPDF} );

            console.log("EL DOCUMENTO YA SE VALIDO");
            
            const mensaje = {
                title: 'Aviso',
                body: 'El documento ya se valido.'
            };
            await notificationService.sendNotificationMulticast(tokens, mensaje);


            if (isPlanDeAccion){
                repo.updateDocument(doc.id, {estado: "finalizado"} );

            }
            else{
                if(needPlandeAccion){
                    repo.updateDocument(doc.id, {estado: "finalizado_sin_plan_accion"} );

                }
                else{
                    repo.updateDocument(doc.id, {estado: "finalizado"} );

                }
            }
        }
    }
    else{
        if (estadoActual == "rechazado" && estadoAnterior !== "rechazado") {
            console.log("EL CHECKLIST HA SIDO RECHAZADO");

            
            const mensaje = {
                title: 'Aviso',
                body: 'El checklist ha sido rechazado'
            };
            await notificationService.sendNotificationMulticast(tokens, mensaje);


            if (!isPlanDeAccion){
                if (needPlandeAccion){
                    repo.updateDocument(doc.id, {estado: "rechazado_sin_plan_accion"} );

                }
                else{
                    //generar PDF luego Enviarlo a la Nube y generar el mensaje
                    const pdf =EnkiCreator.generarPDF(doc)
                    console.log(" pdf:", pdf)
                    console.log("EL DOCUMENTO HA SIDO RECHAZADO");                    
                    const mensaje = {
                        title: 'Aviso',
                        body: 'El documento generado ha sido rechazado'
                    };
                    await notificationService.sendNotificationMulticast(tokens, mensaje);

                    doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento
                    //transformar a JSON el documento.pdf   
                    const jsonPDF = JSON.parse(JSON.stringify(doc.pdf))
                    repo.updateDocument(doc.id, {pdf:jsonPDF});
                }
            }
            else{
                const pdf =EnkiCreator.generarPDF(doc)
                console.log(" pdf:", pdf)
                doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento
                //transformar a JSON el documento.pdf   
                const jsonPDF = JSON.parse(JSON.stringify(doc.pdf))
                repo.updateDocument(doc.id, {pdf:jsonPDF} );

                console.log("EL DOCUMENTO HA SIDO RECHAZADO");                    
                const mensaje = {
                    title: 'Aviso',
                    body: '2 El documento generado ha sido rechazado'
                };
                await notificationService.sendNotificationMulticast(tokens, mensaje);
            }
        }
    }
})

