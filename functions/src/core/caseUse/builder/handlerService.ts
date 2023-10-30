import { Documento } from "../../models";
import { AbstractHandler } from "../../utils";

export class HandlerGenerarPDF extends AbstractHandler {
    handle(documento: Documento): boolean {
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
export class HandlerCambioEstado extends AbstractHandler {
    handle(documento: Documento): boolean {
        console.log('CAMBIANDO ESTADO');
        return true;
    }
}