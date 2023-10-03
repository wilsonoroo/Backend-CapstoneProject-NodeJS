export interface IEmpresa <ARCHIVOEMB,CONFIGEMB,CORRELATIVO,DOC,DOCRESPALDO,DOCMES,GERENCIA,USUARIO,EQUIPO,VEHICULO,PLANSEGUIMIENTO> {
    archivos: ARCHIVOEMB;
    config: CONFIGEMB;
    correlativo: CORRELATIVO;
    documentos: DOC;
    documentosRespaldo: DOCRESPALDO;
    documentosPorMes: DOCMES;
    gerencias: GERENCIA;
    id: string;
    nombre: string;
    usuarios: USUARIO;
    vehiculos: VEHICULO;
    equipos: EQUIPO;
    planesDeSeguimiento: PLANSEGUIMIENTO;
    repositorio: string; // Aqui falta el repo como referenciar
    usuarioRespuesta: string; // es un usuaario ????????
    utils: object; // a que referencia utils
}