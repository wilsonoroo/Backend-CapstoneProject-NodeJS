import {Documento,} from '../../core/models'
// import {convertDocumentTimestampsToDate} from '../../core/utils/';
// import { onDocumentCreated } from 'firebase-functions/v2/firestore';
// import { plainToClass } from "class-transformer";


export abstract class Handler {
    nextHandler?: Handler[];
    setNext(handler: Handler, index:number): Handler{
        if (this.nextHandler) {
            this.nextHandler[index] = handler;
            return handler;
        }
        return handler;
    }
    abstract handle(documento: Documento): boolean;
}


export class HandlerNeedValidacion extends Handler {
    handle(documento: Documento): boolean {
        if (documento.needValidacion()) {
            console.log('el doc necesita validacion');
            if (this.nextHandler && this.nextHandler[0]) {
                this.nextHandler[0].handle(documento);
                return true;
            }
        }
        else{
            if (this.nextHandler && this.nextHandler[1] ) {
                console.log('el doc no necesita validacion');
                this.nextHandler[1].handle(documento);
                return false;
            }
            return false;
        }
        return false;
        //negativo [positivo,negativo,otro]
    }
}

export class HandlerProblemas extends Handler {
    handle(documento: Documento): boolean {
        if (documento.DocumentoConProblemas()) {
            if (this.nextHandler ) {
                this.nextHandler[0].handle(documento);
                return true;
            }
        }
        return false;
        console.log('doc sin problemas');
    }
}

// export const flujoPatronDisenoo = onDocumentCreated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {

//     const data = event.data?.data();
//     const transformedData = convertDocumentTimestampsToDate(data);
//     const doc = plainToClass(Documento, transformedData);
//     console.log("doc:", doc);

//     // .addStep(new HandlerNeedValidacion(),0)
//     // .addStep(new HandlerNeedValidacion(),1)
//     // .addStep(new HandlerProblemas(),0)
//     // .addStep(new HandlerProblemas(),1)
//     // .build();

//     // .addStep(hadler, index)

//     // workflow.handle(doc);


// });


