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
    } from "../builder";

function FlujoGenerarDoc(repo: FirestoreRepository<Documento>): ArbolBinario {
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerPlanAccion();
    const generarPDF = new HandlerGenerarPDF();
    const notificacion = new HandlerNotificacion("mensaje","notificacion de prueba");
    const estadoConProblemas = new HandlerCambioEstado(DocumentoEstado.conProblemas);
    const estadoSinProblemas = new HandlerCambioEstado(DocumentoEstado.sinProblemas);
    const estadoFinalizado = new HandlerCambioEstado(DocumentoEstado.finalizado);
    const estadoFinalizadoPlan = new HandlerCambioEstado(DocumentoEstado.finalizadoPlan);
    const estadoValidado = new HandlerCambioEstado(DocumentoEstado.validado);

    // arbol.insertarNodo([validacion,generarPDF,notificacion,estadoValidado,planAccion,estadoFinalizadoPlan,null,null,estadoFinalizado,null,null,null,null,null,problemas,estadoConProblemas,notificacion,null,null,null,estadoSinProblemas,notificacion]);
    arbol.insertarNodo([validacion,problemas,estadoConProblemas,notificacion,null,null,null,estadoSinProblemas,notificacion,null,null,null,generarPDF,notificacion,estadoValidado,planAccion,estadoFinalizado,null,null,estadoFinalizadoPlan]);
    return arbol;
}
export function procesarDocumento(doc: Documento,repo: FirestoreRepository<Documento>) {
    const arbol = FlujoGenerarDoc(repo);
    arbol.procesarDocumento(doc);
}