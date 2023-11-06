import { Documento } from "../../models";

export interface Handler {
    setNext(handler: Handler): Handler;
    // handle(documento: Documento): void;
    handle(documento: Documento, ...args: any[]): Promise<boolean> | boolean;
}
export abstract class AbstractHandler implements Handler {
    nextHandler: Handler;

    setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    abstract handle(documento: Documento, ...args: any[]): Promise<boolean> | boolean;
}