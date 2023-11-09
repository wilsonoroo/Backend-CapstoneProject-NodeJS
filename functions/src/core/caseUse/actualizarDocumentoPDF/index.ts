import { Documento } from "../../models";
import { FirestoreRepository } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
import {  DocumentoEstado, mensaje } from "../../utils";
import { getUserTokensFromDisplayName } from "../../utils/obtenerEmisor/getTokenEmisor";
import {  
    ArbolBinario,
    HandlerNeedPlanAccion, 
    HandlerGenerarPDF, 
    // HandlerNotificacion,
    HandlerCambioEstado,
    HandlerUpdateDocument,
    HandlerEstadoActual,
    HandlerTienePlanAccion,
    HandlerEstadoAnterior,
    HandlerNotificar, 
    } from "../builder";
/**
 *
 * Flujo para generar arbol binario para actualizar documento
 * @param {FirestoreRepository<Documento>} repo
 * @param {string} empresa
 * @return {*}  {ArbolBinario}
 */
function FlujoActualizarPDF(repo: FirestoreRepository<Documento>,empresa:string,emisorTokens:string[]): ArbolBinario {
    const arbol = new ArbolBinario();
    const notificationService = new NotificationService();
    const mensajeGenerado = mensaje("Importante","Documento generado y validado.");
    const mensajeRechazado = mensaje("Importante","El documento fue rechazado. ");
    const mensajePDFRechazado = mensaje("Aviso","Se ha generado un documento PDF rechazado.");
    const estadoActualValidado = new HandlerEstadoActual(DocumentoEstado.validado,DocumentoEstado.finalizado);
    const estadoActualRechazado = new HandlerEstadoActual(DocumentoEstado.rechazado);
    const estadoAnteriorRechazado = new HandlerEstadoAnterior(DocumentoEstado.rechazado);
    const estadoAnterior = new HandlerEstadoAnterior(DocumentoEstado.conProblemas,DocumentoEstado.sinProblemas);
    const generarPDF = new HandlerGenerarPDF(empresa);
    const notificacionDocGenerado = new HandlerNotificar(notificationService,mensajeGenerado,emisorTokens);//notificar al usuario creador
    const notificacionRechazo = new HandlerNotificar(notificationService,mensajeRechazado,emisorTokens);//notificar al usuario creador
    const notificacionPDFRechazado = new HandlerNotificar(notificationService,mensajePDFRechazado,emisorTokens);//notificar al usuario creador
    const tienePlanAccion = new HandlerTienePlanAccion();
    const needPlanAccion = new HandlerNeedPlanAccion();
    const estadoFinalizado= new HandlerCambioEstado(DocumentoEstado.finalizado);
    const estadoFinalizadoPlanAccion= new HandlerCambioEstado(DocumentoEstado.finalizadoPlan);
    const estadoRechazado = new HandlerCambioEstado(DocumentoEstado.rechazado);
    const estadoRechazadoPlanAccion = new HandlerCambioEstado(DocumentoEstado.rechazadoPlan);
    const actualizacion = new HandlerUpdateDocument(repo);

    arbol.insertarNodo([estadoActualValidado,estadoAnterior,generarPDF,notificacionDocGenerado,tienePlanAccion,estadoFinalizado,actualizacion,null,null,null,needPlanAccion,estadoFinalizadoPlanAccion,actualizacion,null,null,null,estadoFinalizado,actualizacion,null,null,null,null,null,estadoFinalizado,actualizacion,null,null,null,estadoActualRechazado,estadoAnteriorRechazado,null,notificacionRechazo,tienePlanAccion,estadoRechazado,generarPDF,notificacionPDFRechazado,actualizacion,null,null,null,null,null,needPlanAccion,estadoRechazadoPlanAccion,actualizacion,null,null,null,estadoRechazado,generarPDF,notificacionRechazo,actualizacion]);
    return arbol;
}
export async function procesarDocumentoFlujoActualizacion(doc: Documento,docAnterior:Documento,repo: FirestoreRepository<Documento>,empresa:string) {
    try{
        const nombreEmisor = doc.emisor.id;
        if(!nombreEmisor) throw console.log("error en el documento no hay emisor");
        const emisorTokens = await getUserTokensFromDisplayName(nombreEmisor);
        const arbol = FlujoActualizarPDF(repo,empresa,emisorTokens);
        arbol.procesarDocumentoComplejo(doc,docAnterior);
    }catch(error){
        console.log("Error al procesar documento en flujo de actualización",error);
    }

}