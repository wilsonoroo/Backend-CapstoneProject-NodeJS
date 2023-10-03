import {Preguntas} from '../preguntas/preguntas.model';

import {Seccion} from './seccion.model';

export class SeccionPregunta extends Seccion {
  preguntas!: Array<Preguntas>;

  constructor() {
    super();
  }
}
