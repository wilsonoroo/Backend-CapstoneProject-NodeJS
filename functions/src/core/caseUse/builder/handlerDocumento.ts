import { Documento } from "../../models";
import { AbstractHandler } from "./chainOfResponsability";

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

export class HandlerNeedPlanAccion extends AbstractHandler {
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
export class HandlerEstadoActual extends AbstractHandler{
    estado: string;
    estado2?: string;
    constructor(estado: string,estado2?: string) {
        super();
        this.estado = estado;
        if (estado2) this.estado2 = estado2;
    }
    handle(documento: Documento): boolean {
        try{
            if(this.estado2){
                if(this.estado === documento.estado || this.estado2 === documento.estado){
                    return true;
                }
            }else if(this.estado === documento.estado){
                return true;
            }
            return false;
        }catch(error){
            console.log("Falla en el handler de estado actual: ",error);
            return false;
        }

    }
}
export class HandlerEstadoAnterior extends AbstractHandler{
    estado: string;
    estado2?: string;
    constructor(estado: string,estado2?: string) {
        super();
        this.estado = estado;
        if (estado2) this.estado2 = estado2;
    }
    handle(documento: Documento,documentoAnterior?: Documento): boolean {
        try{
            if (!documentoAnterior) return false;
            if(this.estado2){
                if(this.estado === documentoAnterior.estado || this.estado2 === documentoAnterior.estado){
                    return true;
                }
            }else if(this.estado === documentoAnterior.estado){
                return true;
            }
            return false;
        }catch(error){
            console.log("Falla en el handler de estado anterior: ",error);
            return false;
        }

    }
}
export class HandlerTienePlanAccion extends AbstractHandler{
    handle(documento: Documento): boolean {
        try{
            if(documento.isPlanDeAccion){
                return true;
            }
            return false;
        }catch(error){
            console.log("Falla en el handler de tiene plan de accion: ",error);
            return false;
        }

    }
}