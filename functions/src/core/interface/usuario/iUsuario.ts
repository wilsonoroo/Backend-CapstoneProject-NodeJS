

export interface IUsuario <Enrolamiento, Licencia, Fotografia, PermisosWeb, PermisosModel, Dispositivo> {  
    id: string;   
    email: string;
    empresaId: string;
    gerenciaId: string;
    divisionId: string;
    nombre: string;
    displayName: string;
    rut: string;
    empresa: string;
    sexo: string;
    cargo: string;
    isActive: boolean;
    isEliminado: boolean;
    codigoPin: string;
    enrolamiento: Enrolamiento;
    licencias: Licencia;
    fotografia: Fotografia;
    isAdmin: boolean;
    isUserDt: boolean;
    isSuperAdmin: boolean;
    rol: string;
    areaCargo: string;
    fechaVencimientoLicencia: string;
    permisosWeb: PermisosWeb;
    permisos: PermisosModel;
    tipo: string;  
    turno: string;
    dispositivos: Dispositivo;

}

