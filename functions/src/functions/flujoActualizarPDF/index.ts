
import {Documento, User, Respuesta,Checklist,ConfiguracionChecklist} from '../../core/models'
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { onDocumentUpdated,  } from "firebase-functions/v2/firestore";
import {onRequest} from 'firebase-functions/v2/https'
import {Request, Response} from 'firebase-functions'

export const FlujoActualizarPDF = onDocumentUpdated("/documentos/{docId}", async(event) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc = event.data?.after.data() as Documento;
    const docAnterior = event.data?.before.data() as Documento;

    const estadoActual = doc.estado;
    const isPlanDeAccion = doc.isPlanDeAccion;
    const needPlandeAccion = doc.checklist.configuracion.needPlanDeAccion;
    const estadoAnterior =  docAnterior.estado;

    if (estadoActual == "finalizado" || estadoActual  == "validado") {
        if(estadoAnterior === "documento_con_problema"||estadoAnterior === "documento_sin_problema"){
            doc.pdf =EnkiCreator.generarPDF(doc)
            console.log(`el documento generado ya se valido  ${doc.emisor.email}`)
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
                    // repo.updateDocument(doc.id, {estado: "pendiente_validar"} )
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

                }
            }
        }
    }
    else{
        if (estadoActual == "rechazado") {
            console.log(`el checklist ha sido rechazado `)
            if (isPlanDeAccion){
                doc.estado = "rechazado";
                repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

            }
            else{
                if(needPlandeAccion){
                    doc.estado = "rechazado_sin_plan_accion";
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

                }
                else{
                    doc.estado = "rechazado";
                    doc.pdf =EnkiCreator.generarPDF(doc);
                    repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

                    //enviar noti de rechazaso
                }  
            }
        }
    }
})




export function crearDoc(): Documento {
	const user = new User();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd7';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = true;
	doc.emisor = user;
	doc.estado = 'documento_con_problema';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = false;
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


export const generarDoc =onRequest(async (request: Request, response: Response) => {
    const rutaDoc = '/documentos';
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
