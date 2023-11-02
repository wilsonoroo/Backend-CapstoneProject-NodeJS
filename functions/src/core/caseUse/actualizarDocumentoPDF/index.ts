import { Documento } from "../../models";
import { FirestoreRepository } from "../../services";
import {  DocumentoEstado } from "../../utils";
import {  
    ArbolBinario,
    HandlerNeedPlanAccion, 
    HandlerGenerarPDF, 
    HandlerNotificacion,
    HandlerCambioEstado,
    HandlerUpdateDocument,
    HandlerEstadoActual,
    HandlerTienePlanAccion,
    HandlerEstadoAnterior, 
    } from "../builder";

function FlujoActualizarPDF(repo: FirestoreRepository<Documento>,empresa:string): ArbolBinario {
    const arbol = new ArbolBinario();
    const estadoActualValidado = new HandlerEstadoActual(DocumentoEstado.validado,DocumentoEstado.finalizado);
    const estadoActualRechazado = new HandlerEstadoActual(DocumentoEstado.rechazado);
    const estadoAnteriorRechazado = new HandlerEstadoAnterior(DocumentoEstado.rechazado);
    const estadoAnterior = new HandlerEstadoAnterior(DocumentoEstado.conProblemas,DocumentoEstado.sinProblemas);
    const generarPDF = new HandlerGenerarPDF(empresa);
    const notificacionDocGenerado = new HandlerNotificacion("Importante","El documento generado y validado");
    const notificacionRechazo = new HandlerNotificacion("Importante","El documento rechazado");
    const tienePlanAccion = new HandlerTienePlanAccion();
    const needPlanAccion = new HandlerNeedPlanAccion();
    const estadoFinalizado= new HandlerCambioEstado(DocumentoEstado.finalizado);
    const estadoFinalizadoPlanAccion= new HandlerCambioEstado(DocumentoEstado.finalizadoPlan);
    const estadoRechazado = new HandlerCambioEstado(DocumentoEstado.rechazado);
    const estadoRechazadoPlanAccion = new HandlerCambioEstado(DocumentoEstado.rechazadoPlan);
    const updatear = new HandlerUpdateDocument(repo);

    arbol.insertarNodo([estadoActualValidado,estadoAnterior,generarPDF,notificacionDocGenerado,tienePlanAccion,estadoFinalizado,updatear,null,null,null,needPlanAccion,estadoFinalizadoPlanAccion,updatear,null,null,null,estadoFinalizado,updatear,null,null,null,estadoActualRechazado,estadoAnteriorRechazado,notificacionRechazo,tienePlanAccion,estadoRechazado,updatear,null,null,null,needPlanAccion,estadoRechazadoPlanAccion,updatear,null,null,null,estadoRechazado,updatear,null,null,null,estadoRechazado,updatear]);
    return arbol;
}
export function procesarDocumentoFlujoActualizacion(doc: Documento,docAnterior:Documento,repo: FirestoreRepository<Documento>,empresa:string) {
    const arbol = FlujoActualizarPDF(repo,empresa);
    arbol.procesarDocumentoA(doc,docAnterior);
}