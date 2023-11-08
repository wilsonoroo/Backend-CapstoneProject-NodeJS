import { Documento } from "../../models";
import { FirestoreRepository } from "../../services";
import NotificationService from "../../services/notificacion/notificacionFCM";
// import NotificationService from "../../services/notificacion/notificacionFCM";
// import { FirestoreRepository } from "../../services";
import { CustomError } from "../../utils/customError/customError";
// import { getUserTokensFromMap } from "../../utils/getTokens";
import { todosHanFirmado } from "../../utils/verificadorDeFirma/verificador";
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






///////////////////////////////

export class HandlerIsTipoIS extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento?.checklist?.abreviatura === "IS") {
                console.log("El documento es tipo IS");
                return true;
            } else {
                console.log("El documento no es IS");
                return false;
            }
        } catch (error) {
            console.error('Error en HandlerIsTipoIS: El documento no es tipo IS.', error);
            // Puedes decidir si quieres devolver falso o lanzar el error.
            return false;
        }
    }
}

export class HandlerTodosHanFirmado extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.cuadrilla && todosHanFirmado(documento)) {
                console.log("Todos han firmado el documento");
                return true;
            } else {
                console.log("Faltan firmas en la cuadrilla.");
                return false;
            }            
        } catch (error) {
            const customError = new CustomError('Error en HandlerTodosHanFirmado ', "No han firmado todos los integrantes.");
            console.error(customError.toString(), error);
            return false;
            
        }
    }
}

export class HandlerEstadoGenerado extends AbstractHandler {
    handle(documento: Documento): boolean {
        try {
            if (documento.estado == "generado") {
                console.log("El documento está en estado generado");
                return true;
            } else {
                console.log("El documento no está en el estado 'generado'");
                return false;
            }            
        } catch (error) {
            const customError = new CustomError('Error en HandlerEstadoGenerado ', "El estado del documento no es generado.");
            console.error(customError.toString(), error);
            return false;
        }
    }
}


export class HandlerCambioEstadoo extends AbstractHandler {
    private estado: string;

    constructor(estado: string) {
        super();
        this.estado = estado;
    }

    handle(documento: Documento): boolean {
        try {
            documento.estado = this.estado;
            console.log(`Estado del documento cambiado localmente a ${this.estado}`);
            return true;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerCambioEstadoo ', "error al cambiar de estado.");
            console.error(customError.toString(), error);
            return false;
            
        }
    }
}

export class HandlerMoverDocumento extends AbstractHandler {
    private newRepo: FirestoreRepository<Documento>;
    private docId: string;

    constructor(newRepo: FirestoreRepository<Documento>, docId: string) {
        super();
        this.newRepo = newRepo;
        this.docId = docId;
    }

    async handle(documento: Documento): Promise<boolean> {
        try {
            await this.newRepo.addDocumentById(this.docId, documento);
            console.log("Documento movido a la nueva ruta");
            return true;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerMoverDocumento ', "Error al mover el documento.");
            console.error(customError.toString(), error);
            return false;

        }
    }
}

export class HandlerEliminarDocumentoOriginal extends AbstractHandler {
    private repo: FirestoreRepository<Documento>;
    private docId: string;

    constructor(repo: FirestoreRepository<Documento>, docId: string) {
        super();
        this.repo = repo;
        this.docId = docId;
    }

    async handle(documento: Documento): Promise<boolean> {
        try {
            await this.repo.deleteDocument(this.docId);
            console.log("Documento original eliminado");
            return true;            
        } catch (error) {
            const customError = new CustomError('Error en HandlerEliminarDocumentoOriginal ', "Error al eliminar documento.");
            console.error(customError.toString(), error);
            return false;
            
        }
    }
}



export class HandlerNotificar extends AbstractHandler {
    private notificationService: NotificationService;
    private mensaje: any;
    private validadoresTokens: string[]; // Agregar esta línea

    constructor(notificationService: NotificationService, mensaje: any, validadoresTokens: string[]) {
        super();
        this.notificationService = notificationService;
        this.mensaje = mensaje;
        this.validadoresTokens = validadoresTokens; // Asignar los tokens aquí
    }

    async handle(documento: Documento): Promise<boolean> {
        try {
            if (this.validadoresTokens.length > 0) {
                const response = await this.notificationService.sendNotificationMulticast(this.validadoresTokens, this.mensaje);
                if (response.success) {
                    console.log("Notificación enviada exitosamente");
                    return true;
                } else {
                    console.error("Error enviando notificación:", response.error);
                    return false;
                }
            } else {
                console.log("No se encontraron tokens para enviar notificaciones");
                return false;
            }
        } catch (error) {
            console.error("Error al enviar notificación a los validadores", error);
            return false;
        }
    }
}



export class HandlerVerificarCreacion extends AbstractHandler {
    private beforeData: Documento | undefined;

    constructor(beforeData: Documento | undefined) {
        super();
        this.beforeData = beforeData;
    }

    handle(documento: Documento): boolean {
        if (this.beforeData === undefined) {
            console.log("El documento ha sido recién creado");
            return true;
        } else {
            console.log("El documento es una actualización, no una creación");
            return false;
        }
    }
}

