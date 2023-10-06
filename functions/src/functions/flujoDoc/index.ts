import {onRequest} from 'firebase-functions/v2/https'
//const {onDocumentCreated} = require("firebase-functions/v2/firestore");
//const {getFirestore} = require("firebase-admin/firestore");
import {Request, Response} from 'firebase-functions'
import * as functions from "firebase-functions";

import {Documento,} from '../../core/models'
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { crearDoc } from '../helloWord';
const documentID = 'doc1'
export const flujoGeneracionDocumentos = onRequest(async(request: Request, response: Response) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc = await repo.getDocument<Documento>(documentID);


    if (doc.isAutoValidado) {
        //no necesita validacion
        //generarPDF --> servicio
        //Enviar notificacion a doc.emisor.email --> servicio
        console.log(`documento fue validado y enviado a  ${doc.emisor.email}`)
        // cambiar estado a 'validado'
        doc.estado = 'validado';
        repo.updateDocumentParcial<Documento>('doc1',JSON.parse(JSON.stringify(doc))).then((doc) => {
            console.log('actualizando estado del documento')
            response.send(`actualizando estado del documento`)
    
        }).catch((error) => {
            console.error(error)
        });
        if (doc.isPlanDeAccion) {
            doc.estado = 'finalizado_con_plan_accion';
            repo.updateDocumentParcial<Documento>('doc1',JSON.parse(JSON.stringify(doc))).then((doc) => {
                console.log('actualizando estado del documento')
                response.send(`estado con plan de accion`)
        
            }).catch((error) => {
                console.error(error)
            });
        }
        else{
            doc.estado = 'finalizado';
            repo.updateDocumentParcial<Documento>('doc1',JSON.parse(JSON.stringify(doc))).then((doc) => {
                console.log('actualizando estado del documento')
                response.send(`estado finalizado`)
        
            }).catch((error) => {
                console.error(error)
            });
        }
    }
    else{ 
        if (doc.isConCuadrilla) {
            doc.estado = 'doc_con_problemas';
            console.log(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)
            repo.updateDocumentParcial<Documento>('doc1',JSON.parse(JSON.stringify(doc))).then((doc) => {
                console.log('actualizando estado del documento con problemas')
                response.send(`actualizando estado del documento con problemas`)
        
            }).catch((error) => {
                console.error(error)
            });

        }
        if (!doc.isConCuadrilla) {
            doc.estado = 'doc_sin_problemas';
            console.log(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)
            repo.updateDocumentParcial<Documento>('doc1',JSON.parse(JSON.stringify(doc))).then((doc) => {
                console.log('actualizando estado del documento con problemas')
                response.send(`actualizando estado del documento SIN problemas`)
        
            }).catch((error) => {
                console.error(error)
            });
        }
        console.log(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)



    }
    response.send(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)



});


export const escuchandoFlujo = functions.firestore
.document('/documentos/{docId}')
.onUpdate(async (change, context) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc = await repo.getDocument<Documento>(context.params.docId);


    if (!doc.isAutoValidado) {
        //no necesita validacion
        //generarPDF --> servicio
        //Enviar notificacion a doc.emisor.email --> servicio
        console.log(`documento fue validado y enviado a  ${doc.emisor.email}`)
        // cambiar estado a 'validado'
        doc.estado = 'validado';

        if (doc.isPlanDeAccion) {
            doc.estado = 'finalizado_con_plan_accion';
        }
        else {
            doc.estado = 'finalizado';
        }
        repo.updateDocumentParcial<Documento>(context.params.docId,JSON.parse(JSON.stringify(doc))).then((doc) => {
            console.log('actualizando estado del documento')    
        }).catch((error) => {
            console.error(error)
        });
    }
    else{ 
        if (doc.isConCuadrilla) {
            doc.estado = 'doc_con_problemas';
        }
        else {
            doc.estado = 'doc_sin_problemas';
            console.log(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)
        }
        console.log(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)
        repo.updateDocumentParcial<Documento>(context.params.docId,JSON.parse(JSON.stringify(doc))).then((doc) => {
            console.log('ACTUALIZANDO EN LA BD')        
        }).catch((error) => {
            console.error(error)
        });
    }
});


export const actualizarFlujo = functions.firestore
.document('/documentos/{docId}')
.onUpdate(async (change, context) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc = await repo.getDocument<Documento>(context.params.docId);
    const info = actualizar(repo,doc);
    console.log("info:",info);
});
function actualizar(repo: FirestoreRepository<Documento>,doc:Documento): string {

    if (!doc.isAutoValidado) {
        //no necesita validacion
        //generarPDF --> servicio

        doc.pdf =EnkiCreator.generarPDF(doc)
        //Enviar notificacion a doc.emisor.email --> servicio 
        //para enviar la notificacion es sacar el token
        console.log(`documento fue validado y enviado a  ${doc.emisor.email}`)
        // cambiar estado a 'validado'
        doc.estado = 'validado';

        if (doc.isPlanDeAccion) {
            doc.estado = 'finalizado_con_plan_accion';
        }
        else {
            doc.estado = 'finalizado';
        }
    }
    else{ 
        if (doc.isConCuadrilla) {
            doc.estado = 'doc_con_problemas';
        }
        else {
            doc.estado = 'doc_sin_problemas';
            console.log(`documento con estado ${doc.estado} enviando a ${doc.emisor.email}`)
        }
    }
    repo.updateDocumentParcial<Documento>(doc.id,JSON.parse(JSON.stringify(doc))).then((doc) => {
        console.log('ACTUALIZANDO EN LA BD')        
    }).catch((error) => {
        console.error(error)
    });
    return doc.estado;
}


export const flujoNuevoPDF = functions.firestore
.document('/documentos/{docId}')
.onUpdate(async (change, context) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc = await repo.getDocument<Documento>(context.params.docId);
    const info = actualizarNuevoPDF(repo,doc);
    console.log("info:",info);

});
function actualizarNuevoPDF(repo: FirestoreRepository<Documento>,doc:Documento): string {
    const estadoActual = doc.estado;
    const isProblema = true;
    const isPlanDeAccion = doc.isPlanDeAccion;
    const needPlandeAccion = doc.checklist.configuracion.needPlanDeAccion;
    //como saber si mi doc tiene problemas
    if (estadoActual === "finalizado" || estadoActual  === "validado") {
        if(isProblema){
            doc.pdf =EnkiCreator.generarPDF(doc)
            console.log(`el documento generado ya se valido  ${doc.emisor.email}`)
            if (isPlanDeAccion){
                doc.estado = "finalizado"
            }
            else{
                if(needPlandeAccion){
                    doc.estado = "finalizado_sin_plan_accion"
                }
                else{
                    doc.estado = "finalizado"
                }
            }

        }
    }
    else{ 
        if (estadoActual === "rechazado") {
            console.log(`el checklist ha sido rechazado `)
            if (isPlanDeAccion){
                doc.estado = "rechazado"
            }
            else{
                if(needPlandeAccion){
                    doc.estado = "rechazado_sin_plan_accion"
                }
                else{
                    doc.estado = "rechazado"
                    doc.pdf =EnkiCreator.generarPDF(doc)
                    //enviar noti de rechazaso
                }  
            }
        }
    }
    repo.updateDocumentParcial<Documento>(doc.id,JSON.parse(JSON.stringify(doc))).then((doc) => {
        console.log('ACTUALIZANDO EN LA BD')        
    }).catch((error) => {
        console.error(error)
    });
    return doc.estado;
}



export const generarDoc =onRequest(async (request: Request, response: Response) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc2 = crearDoc();
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
