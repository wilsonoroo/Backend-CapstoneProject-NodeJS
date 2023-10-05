import {onRequest} from 'firebase-functions/v2/https'
//const {onDocumentCreated} = require("firebase-functions/v2/firestore");
//const {getFirestore} = require("firebase-admin/firestore");
import {Request, Response} from 'firebase-functions'
import * as functions from "firebase-functions";

import {Documento,} from '../../core/models'
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'
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