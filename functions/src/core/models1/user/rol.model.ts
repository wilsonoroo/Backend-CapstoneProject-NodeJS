import {Permisos} from './permiso.model';

export class Rol {
  displayName!: string;
  nombre!: string;
  permisos!: Array<Permisos>;
}
