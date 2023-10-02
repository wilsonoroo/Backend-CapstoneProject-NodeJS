import { Archivo } from '../archivo/archivo.model';
import { TipoDocumento } from '../check_list/check_list';
import { Dispositivo } from './dipositivo.model';
import { Permisos } from './permiso.model';
import { Rol } from './rol.model';
export declare class User {
    sendNotificacionFirma(tipo: TipoDocumento, empresa: string): void;
    sendNotificacionParaValidar(): void;
    addNotificacionDocumento(): void;
    id: string;
    rut: string;
    turno: string;
    nombre: string;
    displayName: string;
    email: string;
    sexo: string;
    cargo: string;
    codigo: string;
    empresaId: string;
    empresa: string;
    fechaVencimientoLicencia: string;
    licencia: string;
    areaCargo: string;
    isEliminado: boolean;
    fotografia: Archivo;
    rol: Rol;
    dispositivos: Array<Dispositivo>;
    permisos: Array<Permisos>;
    notificacionDocumentos: number;
    notificacionMisDocumentos: number;
    notificacionSeguimientosDePlanes: number;
    notificacionMisSeguimientosDePlanes: number;
    constructor(id: string | null);
}
//# sourceMappingURL=user.model.d.ts.map