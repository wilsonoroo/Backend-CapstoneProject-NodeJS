import { ConfiguracionChecklist } from '../configuracion/ConfiguracionChecklist.model';
import { SeccionPregunta } from '../seccion_pregunta/SeccionPregunta.model';
import { Documento } from './documento.model';

export class CheckList extends Documento {
  nombre!: string;
  descripcion!: string;
  faena!: string;
  icono!: string;
  instrcciones!: string;
  tag!: string;
  empresa!: string;
  abreviatura!: string;
  gerencia!: string;
  ubicacion!: string;
  empresaId!: string;
  tipo!: string;
  categoria!: string;
  configuracion!: ConfiguracionChecklist;
  nombreEquipo!: string;
  secciones!: Array<SeccionPregunta>;
  seccionesValidacion!: ReadonlyArray<SeccionPregunta>;
}

export enum TipoDocumento {
  InstructivoSeguridad,
  CheckList,
}
