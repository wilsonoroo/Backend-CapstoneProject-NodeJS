export interface IPlanDeSeguimiento <AUTH, ARCHIVO,DOC>{
    id: string;
    estado: string;
    responsable: AUTH;
    fechaCierre?: Date;
    fechaCompromiso: string;
    accionCorrectiva?: string;
    accionSugerida?: string;
    fechaCreacion: Date;
    autor: AUTH;
    evidencias: ARCHIVO;
    documento: DOC;
}