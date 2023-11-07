import { Documento } from "../../models";
import { FirestoreRepository } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
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

function FlujoGenerarDoc(repo: FirestoreRepository<Documento>,empresa:string,validadores:string[],emisorTokens:string[]): ArbolBinario {
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
    const notificacionTieneProblemas = new HandlerNotificar(notificationService, mensajeProblema, validadores);//notificar a los validadores
    const notificacionSinProblemas = new HandlerNotificar(notificationService, mensajeSinProblema, validadores);//notificar a los validadores
    const updatear = new HandlerUpdateDocument(repo);
    const estadoConProblemas = new HandlerCambioEstado(DocumentoEstado.conProblemas);
    const estadoSinProblemas = new HandlerCambioEstado(DocumentoEstado.sinProblemas);
    const estadoFinalizado = new HandlerCambioEstado(DocumentoEstado.finalizado);
    const estadoFinalizadoPlan = new HandlerCambioEstado(DocumentoEstado.finalizadoPlan);
    const estadoValidado = new HandlerCambioEstado(DocumentoEstado.validado);

    arbol.insertarNodo([validacion,problemas,estadoConProblemas,notificacionTieneProblemas,updatear,null,null,null,null,estadoSinProblemas,notificacionSinProblemas,updatear,null,null,null,null,generarPDF,notificacionPDF,estadoValidado,planAccion,estadoFinalizadoPlan,updatear,null,null,null,estadoFinalizado,updatear]);
    return arbol;
}
export async function procesarDocumentoFlujoGenerar(doc: Documento,repo: FirestoreRepository<Documento>,empresa:string) {
    const validadores = doc?.cuadrilla?.validadores;
    const validadoresTokens = validadores ? await getUserTokensFromMap(validadores) : [];
    const NombreEmisor = doc.emisor.displayName;
    const emisorTokens = await getUserTokensFromDisplayName(NombreEmisor);
    const arbol = FlujoGenerarDoc(repo,empresa,validadoresTokens,emisorTokens);
    arbol.procesarDocumento(doc);
}