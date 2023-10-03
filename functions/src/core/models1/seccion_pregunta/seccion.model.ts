import {ImagenReferenciaModel} from './imagen_referencia.model';
import {NoAplica} from './no_aplica.model';

export class Seccion {
  id!: string;
  nombre!: string;
  index!: number;
  instruccion!: string;
  isPaginate!: boolean;
  isNoAplica!: boolean;
  padre!: string;
  noAplica!: NoAplica;
  imagenReferencia!: ImagenReferenciaModel;
  titulo!: string;
}
