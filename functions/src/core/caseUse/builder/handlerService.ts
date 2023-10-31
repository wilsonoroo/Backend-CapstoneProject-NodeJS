import { Documento } from "../../models";
import { FirestoreRepository, } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
import { AbstractHandler, mensaje } from "../../utils";

export class HandlerGenerarPDF extends AbstractHandler {
    handle(documento: Documento): boolean {
        //enki_creator
        //manadar al storage 
        //actualizar doc con el archivo
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
        const notificationService = new NotificationService();
        const enviarMensaje = mensaje(this.titulo, this.cuerpo);
        if (!documento.cuadrilla) return false;
        // const tokens = Object.values(documento.cuadrilla.validadores).map(validador => validador.token);
        //notificationService.sendNotificationMulticast(tokens, enviarMensaje);//falta el await      
        console.log('enviando notificacion'+notificationService+enviarMensaje);
        return true;
    }
}
  
export class HandlerUpdateDocument extends AbstractHandler{
    repositorio: FirestoreRepository<Documento>;
    constructor(repositorio: FirestoreRepository<Documento>) {
        super();
        this.repositorio = repositorio; 
    }
    handle(documento: Documento): boolean {
        this.repositorio.updateDocument(documento.id, JSON.parse(JSON.stringify(documento)));
        console.log('actualizando documento en la base de datos');
        return true;
    }
}