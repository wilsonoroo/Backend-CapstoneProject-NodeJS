
import {Documento, User, Respuesta,Checklist,ConfiguracionChecklist} from '../../core/models';
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { Storage } from '../../core/services/storage/storage';
import { onDocumentUpdated,  } from "firebase-functions/v2/firestore";
import {onRequest} from 'firebase-functions/v2/https';
import {Request, Response} from 'firebase-functions';
import NotificationService from '../../core/services/notificacion/notificacionFCM';
import * as fs from 'fs';
import { plainToClass } from "class-transformer";


const pdfData = fs.readFileSync('Rendicion_Numero_1.pdf');
const empresa = "VAKU";

//Flujo de actualizacion de documentos
export const FlujoActualizarPDF = onDocumentUpdated("/documentos/{docId}", async(event) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    //obtener datos y transformarlo a Documento
    const data = event.data?.after.data();
    const doc = plainToClass(Documento, data as Object);
    //obtener datos anteriores y transformarlo a Documento
    const dataAnterior = event.data?.after.data();
    const docAnterior = plainToClass(Documento, dataAnterior as Object);

    const notificationService = new NotificationService();
    // Extraemos los tokens de los validadores desde el mapa dentro de cuadrilla.
    // const tokens = Object.values(doc.cuadrilla?.validadores).map(validador => validador.codigo);
    const tokens = ["cr2ZLWDhThGW3XfXwWj3HG:APA91bETvBGlmZPgca1coBw220HbjrBG1FXdTwF2h33rDQ_NUQORU4OLu_CbtRcNNutT_XVFB7y2QxPFOG64odgtS_uDXq4nxPHhsjCPIMia2VcZOgjGmpRXfNStbJ0Eg7aJd-zoStoQ"];

    const estadoActual = doc.estado;
    const isPlanDeAccion = doc.isPlanDeAccion;
    const needPlandeAccion = doc.needPlanDeAccion();
    const estadoAnterior =  docAnterior.estado;
    let pdf ; // o var pdf
    console.log("🚀 ~ file: index.ts:33 ~ FlujoActualizarPDF ~ pdf:", pdf)


    if (estadoActual == "finalizado" || estadoActual  == "validado") {
        if(estadoAnterior === "doc_con_problema"||estadoAnterior === "doc_sin_problema"){
            pdf =EnkiCreator.generarPDF(doc)
            // doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento

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
                    pdf =EnkiCreator.generarPDF(doc)
                    // doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento
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
                // pdf =EnkiCreator.generarPDF(doc);
                // doc.pdf = Storage.saveFilePDF(empresa,pdfData);//enviar a storage el documento

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
export function crearDoc(): Documento {
	const user = new User();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd6';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = true;
	doc.emisor = user;
	doc.estado = 'generado';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
	configuracion.cantidadMaximaFotos = 10;
	checklist.configuracion = configuracion;	
	doc.checklist = checklist;
	const respuesta1 = new Respuesta();
	respuesta1.id = 'r1';
	respuesta1.contenido = 'contenido1';
	respuesta1.titulo = 'titulo1';
	respuesta1.tipo = 'tipo1';
	const respuesta2 = new Respuesta();
	respuesta2.id = 'r2';
	respuesta2.contenido = 'contenido2';
	respuesta2.titulo = 'titulo2';
	respuesta2.tipo = 'tipo2';
	const respuesta3 = new Respuesta();
	respuesta3.id = 'r3';
	respuesta3.contenido = 'contenido3';
	respuesta3.titulo = 'titulo3';
	respuesta3.tipo = 'tipo3';
	const respuestaC1 = new Respuesta();
	respuestaC1.id = 'rChiquita1';
	respuestaC1.contenido = 'contenidoChito1';
	respuestaC1.titulo = 'tituloChiquito1';
	respuestaC1.tipo = 'tipoChiquito1';
	const respuestaC2 = new Respuesta();
	respuestaC2.id = 'rChiquita2';
	respuestaC2.contenido = 'contenidoChito2';
	respuestaC2.titulo = 'tituloChiquito2';
	respuestaC2.tipo = 'tipoChiquito2';
	doc.respuestasMalas.push(respuesta1,respuesta2,respuesta3);
	doc.respuestasMalasChildren.push(respuestaC1,respuestaC2);
	
	
	return doc
}

export const obtenerNombres = onDocumentUpdated("/empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event) => {
    const nombreEmpresa = event.params.nombreEmpresa;
    // Storage .saveFilePDF(nombreEmpresa,pdf);
    console.log("🚀 ~ file: index.ts:179 ~ test ~ nombreEmpresa:", nombreEmpresa)
    const nombreGerencia = event.params.nombreGerencia;
    console.log("🚀 ~ file: index.ts:181 ~ test ~ nombreGerencia:", nombreGerencia)
    const nombreDivision = event.params.nombreDivision;
    console.log("🚀 ~ file: index.ts:183 ~ test ~ nombreDivision:", nombreDivision)
    // const datos = event.data?.after.data();
    // const doc = event.data?.after.data() as Documento;
    // Si respuestasMalas es un objeto y deseas convertirlo en un arreglo:
    const docData = event.data?.after.data();
    const doc2 = plainToClass(Documento, docData as Object);
    // console.log("🚀 ~ file: index.ts:193 ~ obtenerNombres ~ doc2:", doc2.needPlanDeAccion())
    // console.log(doc.estado);

    // const docData2 = event.data?.after.data();
    // const doc3 = Object.assign(new Documento(), docData2);
    // console.log("🚀Documento con problemas", doc3.DocumentoConProblemas())

    const needValidacion = doc2.needValidacion();
    console.log("🚀 ~ file: index.ts:203 ~ obtenerNombres ~ needValidacion:", needValidacion)
    const needPlanDeAccion = doc2.needPlanDeAccion(); 
    console.log("🚀 ~ file: index.ts:205 ~ obtenerNombres ~ needPlanDeAccion:", needPlanDeAccion)
    const conProblemas = doc2.DocumentoConProblemas();
    console.log("🚀 ~ file: index.ts:207 ~ obtenerNombres ~ conProblemas:", conProblemas)
});
export const generarDoc =onRequest(async (request: Request, response: Response) => {
    const rutaDoc = '/empresas/VAKU/gerencias/gerencia-1/divisiones/divisiones-1/documentos';
    // const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc2 = crearDoc();
    // let docAux: Partial<Documento> = { ...doc2 };//buscando forma de eliminar y no exista duplicidad
    // delete docAux.respuestasMalas;
    // delete docAux.respuestasMalasChildren;
    
	//pasarle un set al repo 

    try {
        await repo.addDocumentById(doc2.id, JSON.parse(JSON.stringify(doc2)));
        console.log("Se agregó el documento de manera correcta dentro de la bd");

        for (let respuestaMala of doc2.respuestasMalas) {
            let rutaAux = rutaDoc+"/"+ doc2.id+"/RespuestasMalas";
            repo.setReference(rutaAux)

            try {
                await repo.addDocumentById(respuestaMala.id, JSON.parse(JSON.stringify(respuestaMala)));
                console.log("RespmalasAgregadas", respuestaMala.id);

                for (let respuestaMalaChildren of doc2.respuestasMalasChildren) {
                     rutaAux = rutaDoc+"/"+ doc2.id+"/RespuestasMalas/"+respuestaMala.id+"/RespuestasMalasChildren";
                    repo.setReference(rutaAux)
                    try {
                        await repo.addDocumentById(respuestaMalaChildren.id, JSON.parse(JSON.stringify(respuestaMalaChildren)));
                        console.log("Children Agrega2", respuestaMalaChildren.id);        
                    } catch (error) {
                        console.error("Error agregando respuestaMalaChildren:", error);
                    }
                }

            } catch (error) {
                console.error("Error agregando respuestaMala:", error);
            }
        }
       

        response.send('Se agregó el documento y las respuestas malas correctamente');
    } catch (error) {
        console.error(error);
        response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});
export const archivotest = onRequest(async (request: Request, response: Response) => {

    try {
        Storage.saveFilePDF(empresa,pdfData);
        //console.log("ARCHIVO SUBIDO");
        response.send("enviado");        
    } catch (error) {
        console.error(error);
        response.status(500).send('Hubo un error');
    }
});