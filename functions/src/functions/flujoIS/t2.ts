
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository';
import {Documento} from '../../core/models';
import {
    onDocumentWritten,
  } from "firebase-functions/v2/firestore";
import { ArbolBinario, HandlerCambioEstado, HandlerEliminarDocumentoOriginal, HandlerEstadoGenerado, HandlerIsTipoIS, HandlerMoverDocumento, HandlerNotificar, HandlerTodosHanFirmado } from '../../core/caseUse/builder';
import NotificationService from '../../core/services/notificacion/notificacionFCM';
import { getUserTokensFromMap } from '../../core/utils/getTokens';




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
    

    // Si no hay datos antes o después, no hay nada que procesar.
    if (!dataBefore && !dataAfter) {
        console.log("No valid data for before or after snapshot.");
        return;
    }

    // Ahora, asegúrate de que hay una 'cuadrilla' y 'validadores' antes de proceder
    const validadores = dataAfter?.cuadrilla?.validadores || dataBefore?.cuadrilla?.validadores;
    if (!validadores) {
        console.log("No 'cuadrilla' data found in before or after snapshots.");
        return;
    }

    // Asegúrate de que la función 'getUserTokensFromMap' maneje correctamente 'null' o 'undefined'
    const validadoresTokens = validadores ? await getUserTokensFromMap(validadores) : [];

    
    await haciendoElFlujoIS(dataAfter, repo, newRepo, docId, event.params.idEmpresa, validadoresTokens);
    
});

async function flujoIS(repo: FirestoreRepository<Documento>, newRepo: FirestoreRepository<Documento>, docId: string, empresa: string, validadoresTokens: string[]): Promise<ArbolBinario> {
    const arbol = new ArbolBinario();
    const notificationService = new NotificationService();

    const documentoIS = new HandlerIsTipoIS();
    const firmaIntegrantes = new HandlerTodosHanFirmado();
    const estadoGenerado = new HandlerEstadoGenerado();
    
    const mensajeNotificacion = {
        title: "Acción requerida",
        body: "Debes firmar el documento IS pendiente de validación."
    };
    
    const notificarValidadoresHandler = new HandlerNotificar(notificationService, mensajeNotificacion, validadoresTokens);
    const cambioEstado = new HandlerCambioEstado("pendiente_validar");
    const moverDocumento = new HandlerMoverDocumento(newRepo, docId);
    const eliminarDocumentoOriginal = new HandlerEliminarDocumentoOriginal(repo, docId);
    

  
    arbol.insertarNodo([documentoIS, firmaIntegrantes, estadoGenerado, notificarValidadoresHandler, cambioEstado, moverDocumento, eliminarDocumentoOriginal, null, null, null, null, null, null, null,  ]);

    return arbol;
}


export async function haciendoElFlujoIS(doc: Documento, repo: FirestoreRepository<Documento>, newRepo: FirestoreRepository<Documento>, docId: string, empresa: string, validadoresTokens: string[]) {
    const arbol = await flujoIS(repo, newRepo, docId, empresa, validadoresTokens);
    arbol.procesarDocumento(doc);
}


