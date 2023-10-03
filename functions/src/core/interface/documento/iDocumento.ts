export interface IDocumento <AUTH,CHECKLIST,ENCABEZADO,SECCIONRESP,RESPUESTA> {
    id: string;
    encabezado: ENCABEZADO;
    seccionesRespuestas: SECCIONRESP;
    emisor: AUTH;
    seccionesRespuestasValidacion: SECCIONRESP;
    seccionesRespuestasChildren: SECCIONRESP;
    fechaCreacion: Date;
    fechaSubida?: Date; //posiblemente no
    fechaValidacion?: Date; //posiblemente no
    estado: string;     
    isPlanDeAccion: boolean;
    respuestasMalas: RESPUESTA; 
    checklist: CHECKLIST; 
    pdf?:  any; //--> preguntar
    vistos?: any;// que tipo de dato es el vistos  -->preguntar
    checklistChildren:  CHECKLIST;
    respuestasMalasChildren: RESPUESTA;
    dobleValidadorPor: AUTH;

    //metodo para verificar emisor retorna un booleano


    add(): Promise<void>;
    findByID(documentoId: string): Promise<IDocumento<AUTH, CHECKLIST, ENCABEZADO, SECCIONRESP, RESPUESTA> | null>;

}