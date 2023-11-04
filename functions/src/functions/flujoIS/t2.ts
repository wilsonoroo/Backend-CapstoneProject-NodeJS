
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import {Documento} from '../../core/models';
import {
    onDocumentWritten,
  } from "firebase-functions/v2/firestore";
import { ArbolBinario, HandlerCambioEstado, HandlerEliminarDocumentoOriginal, HandlerEstadoGenerado, HandlerIsTipoIS, HandlerMoverDocumento, HandlerNotificarValidadores, HandlerTodosHanFirmado } from '../../core/caseUse/builder';
import NotificationService from '../../core/services/notificacion/notificacionFCM';




export const escuchando2 = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentosRespaldo/{docId}", async(event) => {    
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
    // const empresa = event.params.idEmpresa;
    
    await haciendoElFlujoIS(dataAfter, repo, newRepo, docId, event.params.idEmpresa);

});

async function flujoIS(repo: FirestoreRepository<Documento>, newRepo: FirestoreRepository<Documento>, docId: string, empresa: string): Promise<ArbolBinario> {
    const arbol = new ArbolBinario();
    const notificationService = new NotificationService();

    const documentoIS = new HandlerIsTipoIS();
    const firmaIntegrantes = new HandlerTodosHanFirmado();
    const estadoGenerado = new HandlerEstadoGenerado();
    const cambioEstado = new HandlerCambioEstado("pendiente_validar");

    const mensajeNotificacion = {
        title: "Acción requerida",
        body: "Debes firmar el documento IS pendiente de validación."
    };
    
    const notificarValidadoresHandler = new HandlerNotificarValidadores(notificationService, mensajeNotificacion);

    // Instancia el HandlerMoverDocumento con los parámetros necesarios
    const moverDocumento = new HandlerMoverDocumento(newRepo, docId);

    // Suponiendo que HandlerEliminarDocumentoOriginal requiere el repo y el docId
    const eliminarDocumentoOriginal = new HandlerEliminarDocumentoOriginal(repo, docId);
    
  
    arbol.insertarNodo([documentoIS, firmaIntegrantes, estadoGenerado, cambioEstado, notificarValidadoresHandler, moverDocumento, eliminarDocumentoOriginal]);

    return arbol;
}


export async function haciendoElFlujoIS(doc: Documento, repo: FirestoreRepository<Documento>, newRepo: FirestoreRepository<Documento>, docId: string, empresa: string) {
    const arbol = await flujoIS(repo, newRepo, docId, empresa);
    arbol.procesarDocumento(doc);
}


