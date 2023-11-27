import { Documento } from "../../models";
// import { FirestoreRepository } from "../../services";
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

/**
 * This TypeScript function generates a binary tree that represents the flow of generating a document,
 * including validation, handling problems, generating a PDF, and sending notifications.
 * @param repo - The `repo` parameter is an instance of the `IRepository` interface, which represents a
 * repository for storing and retrieving documents.
 * @param {string} empresa - A string representing the name of the company or organization generating
 * the document.
 * @param {string[]} validadores - An array of strings representing the validators for the document.
 * These validators will be notified if the document has any problems during the generation process.
 * @param {string[]} emisorTokens - An array of tokens representing the users who will receive the
 * notifications.
 * @returns an instance of the `ArbolBinario` class.
 */
async function FlujoGenerarDoc(repo: IRepository<Documento>,empresa:string,validadores:string[],emisorTokens:string[]): Promise<ArbolBinario> {
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

/**
 * This TypeScript function processes a document in a flow generation, using validators and emitters.
 * @param {Documento} doc - The `doc` parameter is of type `Documento`, which represents a document
 * object.
 * @param repo - The `repo` parameter is an instance of a repository class that implements the
 * `IRepository` interface. It is used to interact with the data storage and perform operations such as
 * saving, updating, and retrieving documents.
 * @param {string} empresa - The parameter "empresa" is a string that represents the name or identifier
 * of the company or organization associated with the document processing.
 */
export async function procesarDocumentoFlujoGenerar(doc: Documento,repo: IRepository<Documento>,empresa:string) {
    try{
        const validadores = doc?.cuadrilla?.validadores;
        // if(!validadores ) throw console.log("error en el documento no hay validadores");
        const validadoresTokens = validadores ? await getUserTokensFromMap(validadores) : [];
        const idEmisor = doc.emisor.id;
        const emisorTokens = await getUserTokensFromDisplayName(idEmisor);
        if(!emisorTokens) throw console.log("error en el documento no hay emisor");
        const arbol =  await FlujoGenerarDoc(repo,empresa,validadoresTokens,emisorTokens);
        arbol.procesarDocumento(doc);
    }catch(error){
        console.log("Error al procesar documento en flujo de generación",error);
    }

}