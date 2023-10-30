import { Documento } from "../../models";
import { ArbolBinario } from "../../utils";
import { HandlerNeedValidacion, 
    HandlerPlanAccion, 
    HandlerProblemas, 
    HandlerGenerarPDF, 
    HandlerNotificacion, 
    HandlerCambioEstado } from "../builder";

function FlujoGenerarDoc(): ArbolBinario {
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerPlanAccion();
    const generarPDF = new HandlerGenerarPDF();
    const notificacion = new HandlerNotificacion();
    const cambioEstado = new HandlerCambioEstado();
    // arbol.insertarNodo([validacion,problemas]);
    arbol.insertarNodo([validacion,generarPDF,notificacion,planAccion,cambioEstado,null,null,cambioEstado,null,null,null,null,problemas,cambioEstado,notificacion,null,null,null,generarPDF,notificacion]);
    return arbol;
}
export function procesarDocumento(doc: Documento) {
    const arbol = FlujoGenerarDoc();
    arbol.procesarDocumento(doc);
}