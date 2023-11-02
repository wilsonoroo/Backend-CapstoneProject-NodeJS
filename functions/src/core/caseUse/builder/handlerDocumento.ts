import { Documento } from "../../models";
import { CustomError } from "../../utils/customError/customError";
import { AbstractHandler } from "./chainOfResponsability";

export class HandlerNeedValidacion extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.needValidacion()) {
                console.log('el doc necesita validacion');
                return true;
            }
            console.log('el doc no necesita validacion');
            return false;
        } catch (error) {
            const customError = new CustomError('Error en HandlerNeedValidacion', "Error al validar el documento.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}

export class HandlerProblemas extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.DocumentoConProblemas()) {
                console.log('doc con problemas');
                return true;
            }
            console.log('doc sin problemas');
            return false;
        } catch (error) {
            const customError = new CustomError('Error en HandlerProblemas', "Error en handler con problemas.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}

export class HandlerNeedPlanAccion extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.needPlanDeAccion()){
                console.log('necesita plan de accion');
                return true;
    
            }
            console.log('no necesita plan de accion');
            return false;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerNeedPlanAccion', "Error en handler plan de accion.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}
export class HandlerCambioEstado extends AbstractHandler {
    estado: string;

    constructor(estado: string) {
        super();
        this.estado = estado;
    }

    handle(documento: Documento): boolean {
        try {
            console.log(`Cambiando estado del documento a: ${this.estado}`);
            documento.estado = this.estado;
            return true;
        } catch (error) {
            const customError = new CustomError('Error en HandlerCambioEstado', "Error al cambiar el estado del documento.");
            console.error(customError.toString(), error);
            return false;
        }
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
                    console.log("si hay estado actual "+this.estado);
                    return true;
                }
            }else if(this.estado === documento.estado){
                console.log("si hay estado actual");

                return true;
            }
            console.log(" no hay estado actual");
            return false;
        }catch(error){
            const customError = new CustomError('Error en HandlerEstadoActual', "Error en el handler de estado actual.");
            console.error(customError.toString(), error);
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
    handle(documento: Documento, documentoAnterior?: Documento): boolean {
        try{
            console.log("--> estado anterior ",documentoAnterior?.estado);

            // console.log("documento anteriorrrrrrrrrrrrrrrrrrrrrrrrrrrrr",documentoAnterior);
            // console.log("estadoAnterior: ",documentoAnterior?.estado);
            if (!documentoAnterior) return false;
            if(this.estado2){
                if(this.estado === documentoAnterior.estado || this.estado2 === documentoAnterior.estado){
                    console.log("si hay estado anterior");
                    return true;
                }
            }else if(this.estado === documentoAnterior.estado){
                console.log("si hay estado anterior");
                return true;
            }
            console.log("no hay estado anterior");

            return false;
        }catch(error){
            const customError = new CustomError('Error en HandlerEstadoAnterior', "Error en el handler de estado anterior.");
            console.error(customError.toString(), error);
            return false;
        }

    }
}
export class HandlerTienePlanAccion extends AbstractHandler{
    handle(documento: Documento): boolean {
        try{
            if(documento.isPlanDeAccion){
                console.log("si es plan de accion");

                return true;
            }
            console.log("si no necesita plan de accion");

            return false;
        }catch(error){
            const customError = new CustomError('Error en HandlerTienePlanAccion', "Error en el handler de tiene plan de accion.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}