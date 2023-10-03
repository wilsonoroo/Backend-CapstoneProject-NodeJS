import { Notificaciones } from '../../utils/notificaciones';
import { Archivo } from '../archivo/archivo.model';
import { TipoDocumento } from '../check_list/check_list';

import { Dispositivo } from './dipositivo.model';
import { Permisos } from './permiso.model';
import { Rol } from './rol.model';

export class User {
  sendNotificacionFirma(tipo: TipoDocumento, empresa: string) {
    const tokens: string[] = [];
    this.dispositivos.forEach((dipositivo: Dispositivo) => {
      if (typeof dipositivo.token !== 'undefined') {
        tokens.push(dipositivo.token);
      }
    });
    let body = '';
    let title = '';

    switch (tipo) {
      case TipoDocumento.InstructivoSeguridad:
        body += `Se requiere validación de Instructivo de Seguridad de la empresa ${empresa}.`;
        title = 'Instructivo de Seguridad';
        break;
      case TipoDocumento.CheckList:
        body += `Se requiere validación de Checklist de la empresa ${empresa}.`;
        title = 'CheckList';
        break;
    }
    const msj = {
      title,
      body,
    };
    Notificaciones.sendNotificacionMulticast(tokens, msj);
  }

  sendNotificacionParaValidar() {
    throw new Error('Method not implemented.');
  }

  addNotificacionDocumento() {
    throw new Error('Method not implemented.');
  }

  id: string;

  rut!: string;

  turno!: string;

  nombre!: string;

  displayName!: string;

  email!: string;

  sexo!: string;

  cargo!: string;

  codigo!: string;

  empresaId!: string;

  empresa!: string;

  fechaVencimientoLicencia!: string;

  licencia!: string;

  areaCargo!: string;

  isEliminado!: boolean;

  fotografia!: Archivo;

  rol!: Rol;

  dispositivos!: Array<Dispositivo>;

  permisos!: Array<Permisos>;

  notificacionDocumentos!: number;

  notificacionMisDocumentos!: number;

  notificacionSeguimientosDePlanes!: number;

  notificacionMisSeguimientosDePlanes!: number;

  constructor(id: string | null) {
    if (id) {
      this.id = id;
    } else {
      this.id = '';
    }
  }
}
