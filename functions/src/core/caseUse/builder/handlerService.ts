import { Documento } from "../../models";
// import { EnkiCreator, FirestoreRepository, Storage } from "../../services";
import {  FirestoreRepository,  } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
import {  convertDocumentDatesToTimestamps, mensaje } from "../../utils";
import { CustomError } from "../../utils/customError/customError";
import { AbstractHandler } from "./chainOfResponsability";

export class HandlerGenerarPDF extends AbstractHandler {
    empresa: string;
    constructor(empresa: string) {
        super();
        this.empresa = empresa;    
    }
    handle(documento: Documento): boolean {
        //enki_creator
        // const pdfData = EnkiCreator.generarPDF(documento);//falta la logica de enkicreator
        // //manadar al storage
        // documento.pdf = Storage.saveFilePDF(this.empresa,pdfData);//enviar a storage el documento
        // //actualizar doc con el archivo
        console.log('generando pdf');
        return true;
    }
}
export class HandlerNotificacion extends AbstractHandler {
    titulo: string;
    cuerpo: string;
    constructor(titulo: string, cuerpo: string) {
        super();
        this.titulo = titulo;
        this.cuerpo = cuerpo;
    }
    handle(documento: Documento): boolean {

        try {
            const notificationService = new NotificationService();
            const enviarMensaje = mensaje(this.titulo, this.cuerpo);
            // if (!documento.cuadrilla) return false;
            // const tokens = Object.values(documento.cuadrilla.validadores).map(validador => validador.token);
            //notificationService.sendNotificationMulticast(tokens, enviarMensaje);//falta el await      
            console.log('enviando notificacion'+notificationService+enviarMensaje);
            return true;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerNotificacion', "Error al enviar la notificación.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}
  
export class HandlerUpdateDocument extends AbstractHandler{
    repositorio: FirestoreRepository<Documento>;
    constructor(repositorio: FirestoreRepository<Documento>) {
        super();
        this.repositorio = repositorio; 
    }
    handle(documento: Documento): boolean {
        try {
            convertDocumentDatesToTimestamps(documento);
            this.repositorio.updateDocument(documento.id, JSON.parse(JSON.stringify(documento)));
            console.log('actualizando documento en la base de datos');
            return true;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerUpdateDocument', "Error al updatear un documento.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}