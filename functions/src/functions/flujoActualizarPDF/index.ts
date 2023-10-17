
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


const pdfData = fs.readFileSync('Rendicion_Numero_1.pdf');

//Flujo de actualizacion de documentos
export const FlujoActualizarPDF = onDocumentUpdated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event) => {
    const rutaDoc = `empresas/${event.params.nombreEmpresa}/gerencias/${event.params.nombreGerencia}/divisiones/${event.params.nombreDivision}/documentos`;
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    //obtener datos y transformarlo a Documento
    const data = event.data?.after.data();
    const doc = plainToClass(Documento, data as Documento);
    //obtener datos anteriores y transformarlo a Documento
    const dataAnterior = event.data?.after.data();
    const docAnterior = plainToClass(Documento, dataAnterior as Documento);
    const notificationService = new NotificationService();
    const estadoActual = doc.estado;
    const isPlanDeAccion = doc.isPlanDeAccion;
    const needPlandeAccion = doc.needPlanDeAccion();
    const estadoAnterior =  docAnterior.estado;
    const empresa =  event.params.nombreEmpresa;
    // Revision si hay cuadrilla y validadores  
    if (!doc.cuadrilla || !doc.cuadrilla.validadores) {
        console.log("No hay validadores en la cuadrilla");
        return;
    }
    const tokens = Object.values(doc.cuadrilla?.validadores).map(validador => validador.codigo);

    if (estadoActual == "finalizado" || estadoActual  == "validado") {
        if(estadoAnterior === "doc_con_problema"||estadoAnterior === "doc_sin_problema"){
            const pdf =EnkiCreator.generarPDF(doc)
            console.log(" pdf:", pdf)
            doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento

            console.log("EL DOCUMENTO YA SE VALIDO");
            
            const mensaje = {
                title: 'Aviso',
                body: 'El documento ya se valido.'
            };
            await notificationService.sendNotificationMulticast(tokens, mensaje);


            if (isPlanDeAccion){
                doc.estado = "finalizado"
                repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

            }
            else{
                if(needPlandeAccion){
                    doc.estado = "finalizado_sin_plan_accion"
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

                }
                else{
                    doc.estado = "finalizado"
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

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
                    doc.estado = "rechazado_sin_plan_accion";
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));
                }
                else{
                    //generar PDF luego Enviarlo a la Nube y generar el mensaje
                    const pdf =EnkiCreator.generarPDF(doc)
                    console.log(" pdf:", pdf)
                    doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento
                    console.log("EL DOCUMENTO HA SIDO RECHAZADO");                    
                    const mensaje = {
                        title: 'Aviso',
                        body: 'El documento generado ha sido rechazado'
                    };
                    await notificationService.sendNotificationMulticast(tokens, mensaje);
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

                }
            }
            else{
                const pdf =EnkiCreator.generarPDF(doc)
                console.log(" pdf:", pdf)
                doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento

                console.log("EL DOCUMENTO HA SIDO RECHAZADO");                    
                const mensaje = {
                    title: 'Aviso',
                    body: '2 El documento generado ha sido rechazado'
                };
                await notificationService.sendNotificationMulticast(tokens, mensaje);
                repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

            }
        }
    }
})



//Metodos de prueba de funcionalidaes

// export const archivotest = onRequest(async (request: Request, response: Response) => {

//     try {
//         const doc = Storage.saveFilePDF("VAKU",pdfData);
//         //console.log("ARCHIVO SUBIDO");
//         response.send(doc);        
//     } catch (error) {
//         console.error(error);
//         response.status(500).send('Hubo un error');
//     }
// });