import { Documento } from "../../models";
import { FirestoreRepository } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
import { IRepository } from "../../services/repository/IRepository";
import {  DocumentoEstado, mensaje } from "../../utils";
import { getUserTokensFromMap } from "../../utils/getTokens";
import { getUserTokensFromDisplayName } from "../../utils/obtenerEmisor/getTokenEmisor";
import { 
    ArbolBinario,
    HandlerNeedValidacion, 
    HandlerNeedPlanAccion, 
    HandlerProblemas, 
    HandlerGenerarPDF, 
    // HandlerNotificacion,
    HandlerCambioEstado,
    HandlerUpdateDocument,
    HandlerNotificar, 
    } from "../builder";

function FlujoGenerarDoc(repo: IRepository<Documento>,empresa:string,validadores:string[],emisorTokens:string[]): ArbolBinario {
    const arbol = new ArbolBinario();
    const notificationService = new NotificationService();
    const mensajeProblema = mensaje("Importante","Documento generado con problemas.");
    const mensajeSinProblema = mensaje("Aviso","Documento generado sin problemas.");
    const mensajePDF = mensaje("Aviso","Documento PDF generado");
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerNeedPlanAccion();
    const generarPDF = new HandlerGenerarPDF(empresa);
    // const notificacionPDF = new HandlerNotificacion("Generación de PDF","Se generó el PDF del documento");//*notificar al usuario creador
    const notificacionPDF = new HandlerNotificar(notificationService,mensajePDF,emisorTokens);//*notificar al usuario creador
    const notificacionTieneProblemas = new HandlerNotificar(notificationService, mensajeProblema, emisorTokens);//notificar a los validadores
    const notificacionSinProblemas = new HandlerNotificar(notificationService, mensajeSinProblema, emisorTokens);//notificar a los validadores
    const actualizacion = new HandlerUpdateDocument(repo);
    const estadoConProblemas = new HandlerCambioEstado(DocumentoEstado.conProblemas);
    const estadoSinProblemas = new HandlerCambioEstado(DocumentoEstado.sinProblemas);
    const estadoFinalizado = new HandlerCambioEstado(DocumentoEstado.finalizado);
    const estadoFinalizadoPlan = new HandlerCambioEstado(DocumentoEstado.finalizadoPlan);
    const estadoValidado = new HandlerCambioEstado(DocumentoEstado.validado);

    arbol.insertarNodo([validacion,problemas,estadoConProblemas,notificacionTieneProblemas,actualizacion,null,null,null,null,estadoSinProblemas,notificacionSinProblemas,actualizacion,null,null,null,null,generarPDF,notificacionPDF,estadoValidado,planAccion,estadoFinalizadoPlan,actualizacion,null,null,null,estadoFinalizado,actualizacion]);
    return arbol;
}
export async function procesarDocumentoFlujoGenerar(doc: Documento,repo: IRepository<Documento>,empresa:string) {
    try{
        const validadores = doc?.cuadrilla?.validadores;
        // if(!validadores ) throw console.log("error en el documento no hay validadores");
        const validadoresTokens = validadores ? await getUserTokensFromMap(validadores) : [];
        const nombreEmisor = doc.emisor.displayName;
        const emisorTokens = await getUserTokensFromDisplayName(nombreEmisor);
        if(!emisorTokens) throw console.log("error en el documento no hay emisor");
        const arbol = FlujoGenerarDoc(repo,empresa,validadoresTokens,emisorTokens);
        arbol.procesarDocumento(doc);
    }catch(error){
        console.log("Error al procesar documento en flujo de generación",error);
    }

}