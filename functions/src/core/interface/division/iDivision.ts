export interface  IDivision <USUARIO,DOC,EQUIPO,HERRAMIENTA,VEHICULO,DOCUSUARIO,PLANUSUARIO> {
    id: string;
    codigo: string;
    createdAt: Date;
    updateAt: Date;
    displayName: string;
    nombre: string;
    faena: string;
    responsable: USUARIO;
    tipoDivison: string;
    documentos: DOC[];
    usuarios: USUARIO;
    equipos: EQUIPO;
    herramienta: HERRAMIENTA;
    vehiculos: VEHICULO; 
    documentosUsuarios: DOCUSUARIO;
    configDocumentos: string;
    planesDeSeguimiento: PLANUSUARIO;
}