export interface IUsuarioDivision {
    id: string;
    email: string;
    isEliminado: boolean;
    isActive: boolean;
    turno: string;
    fechaVencimientoLicencia: string;
    licencia: string;
    notificacionDocumento: number;
    notificacionMisDocumento: number;
    notificacionSeguimientosDePlanes: number;
    notificacionMisSeguimientosDePlanes: number;
    divisones: string;
}
