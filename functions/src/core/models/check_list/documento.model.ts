import { Type } from 'class-transformer';

import { Archivo } from '../archivo/archivo.model';
import { Encabezado } from '../seccion_pregunta/encabezado.model';
import { Respuesta } from '../seccion_pregunta/respuesta.model';
import { SeccionRespuesta } from '../seccion_pregunta/seccion_respuesta.model';
import { User } from '../user/user.model';

import { CheckList, TipoDocumento } from './check_list';
import { FirmaCuadrilla } from './firma_cuadrilla.model';
import { Visto } from './visto.model';

export class Documento {
  encabezadoTieneKilometrage(): boolean {
    if (this.encabezado.kilometraje !== null) {
      return true;
    } else {
      return false;
    }
  }
  updateKilometraje() {
    this.encabezado.vehiculo.updateKilometraje(this.encabezado.kilometraje);
  }

  encabezadoTieneVehiculo(): boolean {
    if (this.encabezado.vehiculo !== null) {
      return true;
    } else {
      return false;
    }
  }
  validarFechaValidacionAndCreacion() {
    throw new Error('Method not implemented.');
  }
  getTypeDocumento(): TipoDocumento {
    if (this.checklist.tipo === 'instructivo_seguridad') {
      return TipoDocumento.InstructivoSeguridad;
    } else if (this.checklist.tipo === 'checklist') {
      return TipoDocumento.CheckList;
    }
    return TipoDocumento.CheckList;
  }
  tieneValidadores(): boolean {
    if (this.cuadrilla.validadores.length === 0) {
      return false;
    } else {
      return true;
    }
  }
  getTurnoEmisor(): string {
    return this.emisor.turno;
  }
  getValidadores(): any {
    throw new Error('Method not implemented.');
  }
  needValidacion(): boolean {
    throw new Error('Method not implemented.');
  }
  getConfigValidacion(): boolean {
    throw new Error('Method not implemented.');
  }
  tieneRespuestasMalas(): boolean {
    throw new Error('Method not implemented.');
  }
  setEstado(DocConProblemas: EstadoDocumento) {
    this.estado = DocConProblemas;
  }
  setCorrelativo(correlativo: any) {
    this.correlativo = correlativo;
  }
  setFechaSubida(fechaSubida: Date) {
    this.fechaSubida = fechaSubida;
  }
  setPdf(pdf: any) {
    this.pdf = pdf;
    throw new Error('Method not implemented.');
  }
  getEstado(): EstadoDocumento {
    throw new Error('Method not implemented.');
  }
  upDate() {
    throw new Error('Method not implemented.');
  }
  id!: string | null;
  correlativo!: string;
  isPlanDeAccion!: boolean;
  @Type(() => Date)
  fechaCreacion!: Date; // hora del celular

  @Type(() => Date)
  fechaSubida!: Date; // hora del servidor

  @Type(() => Date)
  fechaValidacion!: Date; // hora del servidor

  estado!: EstadoDocumento;

  @Type(() => User)
  emisor!: User;

  @Type(() => User)
  supervisor!: User;

  @Type(() => User)
  validadoPor!: User;

  @Type(() => Encabezado)
  encabezado!: Encabezado;

  @Type(() => SeccionRespuesta)
  seccionesRespuestas!: Array<SeccionRespuesta>;

  @Type(() => Respuesta)
  respuestasMalas!: Array<Respuesta>;

  @Type(() => CheckList)
  checklist!: CheckList;

  @Type(() => FirmaCuadrilla)
  cuadrilla!: FirmaCuadrilla;

  @Type(() => Archivo)
  pdf!: Archivo;
  @Type(() => Visto)
  vistos!: Array<Visto>;
  @Type(() => SeccionRespuesta)
  seccionesRespuestasValidacion!: Array<SeccionRespuesta>;

  // para la IS
  isAutovalidacion!: boolean;
  isConCuadrilla!: boolean;

  // transportes_de_carga
  @Type(() => CheckList)
  checklistChildren!: CheckList;
  @Type(() => SeccionRespuesta)
  seccionesRespuestasChildren!: Array<SeccionRespuesta>;
  @Type(() => Respuesta)
  respuestasMalasChildren!: Array<Respuesta>;
}

export class DocumentoCollection extends Array<Documento> {
  // custom array functions ...
}

export enum EstadoDocumento {
  PendienteValidar,
  Rechazado,
  Validado,
  Finalizado,
  DocConProblemas,
  DocSinProblemas,
}
