import {Documento,} from '../../core/models'
import {convertDocumentTimestampsToDate} from '../../core/utils/';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { plainToClass } from "class-transformer";


interface Handler {
    setNext(handler: Handler): Handler;
    handle(documento: Documento): void;
}
abstract class AbstractHandler implements Handler{
    private nextHandler: Handler;
    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }
    public handle(documento: Documento): void {
        // this.doHandle(documento);
        if (this.nextHandler) {
            return this.nextHandler.handle(documento);
        }
    }
    // abstract doHandle(documento: Documento): boolean;
}
class HandlerNeedValidacion extends AbstractHandler {
    doHandle(documento: Documento): boolean {
        if (documento.needValidacion()) {
            console.log('el doc necesita validacion');
            return true;
        }
        console.log('el doc no necesita validacion');
        return false;
    }
}

class HandlerProblemas extends AbstractHandler {
    doHandle(documento: Documento): boolean {
        if (documento.DocumentoConProblemas()) {
            console.log('doc con problemas');
            return true;
        }
        console.log('doc sin problemas');
        return false;
    }
}
class GenerarPDF extends AbstractHandler {
    doHandle(documento: Documento): boolean {
        if (documento.pdf) {
            console.log('hay pdf siii ');
            return true;
        }
        console.log('no hay pdf');
        return false;
    }
}
class WorkflowBuilder {
    private steps: Handler[] = [];

    addStep(handler: Handler): WorkflowBuilder {
        if (this.steps.length) {
            this.steps[this.steps.length - 1].setNext(handler);
        }
        this.steps.push(handler);
        return this;
    }
    

    build(): Handler {
        if (!this.steps.length) {
            throw new Error('No steps added!');
        }
        return this.steps[0];
    }
}
export const PruebasPatron = onDocumentCreated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {

    const data = event.data?.data();
    const transformedData = convertDocumentTimestampsToDate(data);
    const doc = plainToClass(Documento, transformedData);
    console.log("doc:", doc);

    const workflow = new WorkflowBuilder()
    .addStep(new HandlerNeedValidacion())
    .addStep(new HandlerProblemas())
    .addStep(new GenerarPDF())
    .build();

    workflow.handle(doc);


});