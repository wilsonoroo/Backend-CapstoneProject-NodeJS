import { Documento } from "../../models";
import { AbstractHandler } from "../../utils";
import { CustomError } from "../../utils/customError/CustomError";

export class HandlerNeedValidacion extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.needValidacion()) {
                console.log('el doc necesita validacion');
                return true;
            }
            cambiarEstado('validado', documento);
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
                cambiarEstado('doc_con_problemas',documento);
                return true;
            }
            cambiarEstado('doc_sin_problemas',documento);
            console.log('doc sin problemas');
            return false;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerProblemas', "Error al comprobar problemas en el documento.");
            console.error(customError.toString(), error);
            return false;
            
        }
    }
}

export class HandlerPlanAccion extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.needPlanDeAccion()) {
                console.log('necesita plan de accion');
                cambiarEstado('finalizado_sin_plan_accion', documento);
                return true;
            }
            cambiarEstado('finalizado', documento);
            console.log('no necesita plan de accion');
            return false;
        } catch (error) {
            const customError = new CustomError('Error en HandlerPlanAccion', "Error al comprobar necesidad de plan de acción.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}
// export function cambiarEstado(nuevoEstado: string,doc: Documento, repo: FirestoreRepository<Documento>)  {
//     repo.updateDocument(doc.id, {estado: nuevoEstado} );
//     //logica update 1 parametro
// }
export function cambiarEstado(nuevoEstado: string, doc: Documento) {
    try {
        doc.estado = nuevoEstado;
    } catch (error) {
        const customError = new CustomError('Error al cambiar el estado', "Error al actualizar el estado del documento.");
        console.error(customError.toString(), error);
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
