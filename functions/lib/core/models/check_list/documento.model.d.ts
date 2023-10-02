import { Archivo } from '../archivo/archivo.model';
import { Encabezado } from '../seccion_pregunta/encabezado.model';
import { Respuesta } from '../seccion_pregunta/respuesta.model';
import { SeccionRespuesta } from '../seccion_pregunta/seccion_respuesta.model';
import { User } from '../user/user.model';
import { CheckList, TipoDocumento } from './check_list';
import { FirmaCuadrilla } from './firma_cuadrilla.model';
import { Visto } from './visto.model';
export declare class Documento {
    encabezadoTieneKilometrage(): boolean;
    updateKilometraje(): void;
    encabezadoTieneVehiculo(): boolean;
    validarFechaValidacionAndCreacion(): void;
    getTypeDocumento(): TipoDocumento;
    tieneValidadores(): boolean;
    getTurnoEmisor(): string;
    getValidadores(): any;
    needValidacion(): boolean;
    getConfigValidacion(): boolean;
    tieneRespuestasMalas(): boolean;
    setEstado(DocConProblemas: EstadoDocumento): void;
    setCorrelativo(correlativo: any): void;
    setFechaSubida(fechaSubida: Date): void;
    setPdf(pdf: any): void;
    getEstado(): EstadoDocumento;
    upDate(): void;
    id: string | null;
    correlativo: string;
    isPlanDeAccion: boolean;
    fechaCreacion: Date;
    fechaSubida: Date;
    fechaValidacion: Date;
    estado: EstadoDocumento;
    emisor: User;
    supervisor: User;
    validadoPor: User;
    encabezado: Encabezado;
    seccionesRespuestas: Array<SeccionRespuesta>;
    respuestasMalas: Array<Respuesta>;
    checklist: CheckList;
    cuadrilla: FirmaCuadrilla;
    pdf: Archivo;
    vistos: Array<Visto>;
    seccionesRespuestasValidacion: Array<SeccionRespuesta>;
    isAutovalidacion: boolean;
    isConCuadrilla: boolean;
    checklistChildren: CheckList;
    seccionesRespuestasChildren: Array<SeccionRespuesta>;
    respuestasMalasChildren: Array<Respuesta>;
}
export declare class DocumentoCollection extends Array<Documento> {
}
export declare enum EstadoDocumento {
    PendienteValidar = 0,
    Rechazado = 1,
    Validado = 2,
    Finalizado = 3,
    DocConProblemas = 4,
    DocSinProblemas = 5
}
//# sourceMappingURL=documento.model.d.ts.map