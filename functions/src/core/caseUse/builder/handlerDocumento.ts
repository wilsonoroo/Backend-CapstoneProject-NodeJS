import { Documento } from "../../models";
import { AbstractHandler } from "../../utils";

export class HandlerNeedValidacion extends AbstractHandler {
    handle(documento: Documento): boolean {
        if (documento.needValidacion()) {
            console.log('el doc necesita validacion');
            return true;
        }
        cambiarEstado('validado',documento);
        console.log('el doc no necesita validacion');
        return false;
    }
}

export class HandlerProblemas extends AbstractHandler {
    handle(documento: Documento): boolean {
        if (documento.DocumentoConProblemas()) {
            console.log('doc con problemas');
            cambiarEstado('doc_con_problemas',documento);
            return true;
        }
        cambiarEstado('doc_sin_problemas',documento);
        console.log('doc sin problemas');
        return false;
    }
}

export class HandlerPlanAccion extends AbstractHandler {
    handle(documento: Documento): boolean {
        if (documento.needPlanDeAccion()){
            console.log('necesita plan de accion');
            cambiarEstado('finalizado_sin_plan_accion',documento);

            return true;

        }
        cambiarEstado('finalizado',documento);
        console.log('no necesita plan de accion');
        return false;
    }
}
// export function cambiarEstado(nuevoEstado: string,doc: Documento, repo: FirestoreRepository<Documento>)  {
//     repo.updateDocument(doc.id, {estado: nuevoEstado} );
//     //logica update 1 parametro
// }
export function cambiarEstado(nuevoEstado: string,doc: Documento)  {
    doc.estado = nuevoEstado;
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
