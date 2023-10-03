import {Archivo} from '../archivo/archivo.model';

import {Permisos} from './permiso.model';
import {Rol} from './rol.model';

export class UserCompact {
  id: string;
  rut!: string;
  nombre!: string;
  displayName!: string;
  email!: string;
  sexo!: string;
  cargo!: string;
  codigo!: string;
  empresaId!: string;
  empresa!: string;
  areaCargo!: string;
  fotografia!: Archivo;
  rol!: Rol;
  permisos!: Array<Permisos>;
  turno!: string;

  constructor(id: string) {
    this.id = id;
  }
}
