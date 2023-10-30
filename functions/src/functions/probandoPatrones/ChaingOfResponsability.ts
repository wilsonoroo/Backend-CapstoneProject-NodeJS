import {Documento,} from '../../core/models'

export interface Handler {
    setNext(handler: Handler): Handler;
    handle(documento: Documento): void;
}
export abstract class AbstractHandler implements Handler{
    nextHandler: Handler;
    setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }
    abstract handle(documento: Documento):boolean;
}
export class HandlerNeedValidacion extends AbstractHandler {
    handle(documento: Documento): boolean {
        if (documento.needValidacion()) {
            console.log('el doc necesita validacion');
            return true;
        }
        console.log('el doc no necesita validacion');
        return false;
    }
}

export class HandlerProblemas extends AbstractHandler {
    handle(documento: Documento): boolean {
        if (documento.DocumentoConProblemas()) {
            console.log('doc con problemas');
            return true;
        }
        console.log('doc sin problemas');
        return false;
    }
}
export class HandlerPlanAccion extends AbstractHandler {
    handle(documento: Documento): boolean {
        console.log('con plan de accion');
        return true;
    }
}
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