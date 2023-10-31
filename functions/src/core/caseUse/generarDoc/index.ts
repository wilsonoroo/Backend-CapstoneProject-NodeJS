import { Documento } from "../../models";
import { FirestoreRepository } from "../../services";
import { ArbolBinario, DocumentoEstado } from "../../utils";
import { HandlerNeedValidacion, 
    HandlerPlanAccion, 
    HandlerProblemas, 
    HandlerGenerarPDF, 
    HandlerNotificacion,
    // HandlerUpdateDocument,
    HandlerCambioEstado,
    HandlerUpdateDocument, 
    } from "../builder";

function FlujoGenerarDoc(repo: FirestoreRepository<Documento>,empresa:string): ArbolBinario {
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerPlanAccion();
    const generarPDF = new HandlerGenerarPDF(empresa);
    const notificacionPDF = new HandlerNotificacion("Generación de PDF","Se generó el PDF del documento");
    const notificacionTieneProblemas = new HandlerNotificacion("Importante","El documento generado tiene problemas");
    const notificacionSinProblemas = new HandlerNotificacion("Aviso","El documento generado no tiene problemas");
    // const notificacion = new HandlerNotificacion("mensaje","notificacion de prueba");
    const updatear = new HandlerUpdateDocument(repo);
    // console.log("updatear",updatear);//falta implementarlo en el flujo
    const estadoConProblemas = new HandlerCambioEstado(DocumentoEstado.conProblemas);
    const estadoSinProblemas = new HandlerCambioEstado(DocumentoEstado.sinProblemas);
    const estadoFinalizado = new HandlerCambioEstado(DocumentoEstado.finalizado);
    const estadoFinalizadoPlan = new HandlerCambioEstado(DocumentoEstado.finalizadoPlan);
    const estadoValidado = new HandlerCambioEstado(DocumentoEstado.validado);

    // arbol.insertarNodo([validacion,generarPDF,notificacion,estadoValidado,planAccion,estadoFinalizadoPlan,null,null,estadoFinalizado,null,null,null,null,null,problemas,estadoConProblemas,notificacion,null,null,null,estadoSinProblemas,notificacion]);
    // arbol.insertarNodo([validacion,problemas,estadoConProblemas,notificacionTieneProblemas,null,null,null,estadoSinProblemas,notificacionSinProblemas,null,null,null,generarPDF,notificacionPDF,estadoValidado,planAccion,estadoFinalizadoPlan,null,null,estadoFinalizado]);
    arbol.insertarNodo([validacion,problemas,estadoConProblemas,notificacionTieneProblemas,updatear,null,null,null,null,estadoSinProblemas,notificacionSinProblemas,updatear,null,null,null,null,generarPDF,notificacionPDF,estadoValidado,planAccion,estadoFinalizadoPlan,updatear,null,null,null,estadoFinalizado,updatear]);
    return arbol;
}
export function procesarDocumento(doc: Documento,repo: FirestoreRepository<Documento>,empresa:string) {
    const arbol = FlujoGenerarDoc(repo,empresa);
    arbol.procesarDocumento(doc);
}