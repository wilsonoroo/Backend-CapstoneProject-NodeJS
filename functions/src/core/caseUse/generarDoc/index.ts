import { Documento } from "../../models";
import { FirestoreRepository } from "../../services/repository/FirestoreRepository";
import { ArbolBinario } from "../../utils";
import { HandlerNeedValidacion, 
    HandlerPlanAccion, 
    HandlerProblemas, 
    HandlerGenerarPDF, 
    HandlerNotificacion,
    HandlerUpdateDocument, 
    } from "../builder";

function FlujoGenerarDoc(repo: FirestoreRepository<Documento>): ArbolBinario {
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerPlanAccion();
    const generarPDF = new HandlerGenerarPDF();
    const notificacion = new HandlerNotificacion();
    const cambioEstado = new HandlerUpdateDocument(repo);
    // arbol.insertarNodo([validacion,problemas]);
    arbol.insertarNodo([validacion,generarPDF,notificacion,planAccion,cambioEstado,null,null,cambioEstado,null,null,null,null,problemas,cambioEstado,notificacion,null,null,null,generarPDF,notificacion]);
    return arbol;
}
export function procesarDocumento(doc: Documento,repo: FirestoreRepository<Documento>) {
    const arbol = FlujoGenerarDoc(repo);
    arbol.procesarDocumento(doc);
}