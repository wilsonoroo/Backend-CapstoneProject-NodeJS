import { Documento } from "../../models";

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