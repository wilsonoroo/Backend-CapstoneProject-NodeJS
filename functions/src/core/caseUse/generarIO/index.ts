import { Documento } from "../../models";
// import { FirestoreRepository } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
import { IRepository } from "../../services/repository/IRepository";
import {  DocumentoEstado, mensaje } from "../../utils";
import { getUserTokensFromMap } from "../../utils/getTokens";
import { 
    ArbolBinario,
    HandlerCambioEstado,
    HandlerNotificar,
    HandlerTodosHanFirmado,
    HandlerEstadoGenerado,
    HandlerMoverDocumento,
    HandlerEliminarDocumentoOriginal,
    HandlerVerificarCreacion, 
    HandlerIsTipoIO,
    } from "../builder";

async function FlujoGenerarIO(docId: string, docBefore: Documento,repo: IRepository<Documento>,newRepo: IRepository<Documento>,validadoresTokens:string[],integrantesTokens:string[]): Promise<ArbolBinario> {
    const arbol = new ArbolBinario();
    const notificationService = new NotificationService();

    const documentoIO = new HandlerIsTipoIO();
    const firmaIntegrantes = new HandlerTodosHanFirmado();
    const estadoGenerado = new HandlerEstadoGenerado();
    const mensajeNotificacion = mensaje("Acción requerida","Debes firmar el documento IO pendiente de validación.");  
    const notificarValidadoresHandler = new HandlerNotificar(notificationService, mensajeNotificacion, validadoresTokens);
    const cambioEstado = new HandlerCambioEstado(DocumentoEstado.pendienteValidar);
    const moverDocumento = new HandlerMoverDocumento(newRepo, docId);
    const eliminarDocumentoOriginal = new HandlerEliminarDocumentoOriginal(repo, docId);

    const verificarCreacion = new HandlerVerificarCreacion(docBefore);
    const mensajeNotificacion2 = mensaje("FIRMA INTEGRANTES","I Debes firmar el documento IO pendiente de validación.");  
    const notificarIntegrantes = new HandlerNotificar(notificationService, mensajeNotificacion2, integrantesTokens); 
    
    arbol.insertarNodo([documentoIO, firmaIntegrantes, estadoGenerado, notificarValidadoresHandler, cambioEstado, moverDocumento, eliminarDocumentoOriginal, null, null, null, null, null, null, verificarCreacion, notificarIntegrantes]);

    return arbol;
}
export async function procesarFlujoIO(docBefore: Documento,docAfter: Documento,repo: IRepository<Documento>,newrepo: IRepository<Documento>) {
    try{
        const validadores = docAfter?.cuadrilla?.validadores || docBefore?.cuadrilla?.validadores;
        const integrantes = docAfter?.cuadrilla?.integrantes || docBefore?.cuadrilla?.integrantes;        
        const validadoresTokens = validadores ? await getUserTokensFromMap(validadores) : [];
        const integrantesTokens = integrantes ? await getUserTokensFromMap(integrantes) : [];

        const arbol = await FlujoGenerarIO(docAfter.id,docBefore,repo,newrepo,validadoresTokens,integrantesTokens)
        arbol.procesarDocumento(docAfter);
    }catch(error){
        console.log("Error al procesar documento en flujo de IO",error);
    }

}