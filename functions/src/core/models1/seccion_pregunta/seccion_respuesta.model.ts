import {Respuesta} from './respuesta.model';
import {Seccion} from './seccion.model';

export class SeccionRespuesta extends Seccion {
  respuestas!: Array<Respuesta>;
}
