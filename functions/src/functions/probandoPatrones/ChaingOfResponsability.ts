import {Documento,} from '../../core/models'

interface Handler {
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
