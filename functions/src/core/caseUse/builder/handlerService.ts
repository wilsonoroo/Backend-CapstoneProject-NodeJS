import { Documento } from "../../models";
import { FirestoreRepository } from "../../services/repository/FirestoreRepository";
import { AbstractHandler } from "../../utils";

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
    handle(documento: Documento): boolean {
        console.log('enviando notificacion');
        return true;
    }
}
export function mensaje() {
    console.log('mensaje');
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