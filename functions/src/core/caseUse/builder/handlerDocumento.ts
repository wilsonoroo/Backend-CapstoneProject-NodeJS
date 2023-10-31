import { Documento } from "../../models";
import { AbstractHandler } from "../../utils";

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
        if (documento.needPlanDeAccion()){
            console.log('necesita plan de accion');
            return true;

        }
        console.log('no necesita plan de accion');
        return false;
    }
}
export class HandlerCambioEstado extends AbstractHandler {
    estado: string;

    constructor(estado: string) {
        super();
        this.estado = estado;
    }

    handle(documento: Documento): boolean {
        console.log(`Cambiando estado del documento a: ${this.estado}`);
        documento.estado = this.estado;
        return true; 
    }
}
