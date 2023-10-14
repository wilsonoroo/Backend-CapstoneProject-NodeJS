export interface IDocumento<AUTH,CUADRILLA, CHECKLIST, ENCABEZADO, SECCIONRESP, RESPUESTA> {
	id: string;
	checklist: CHECKLIST;
	checklistChildren: CHECKLIST;
	correlativo?: string;
	cuadrilla?: CUADRILLA; 
	emisor: AUTH;
	encabezado: ENCABEZADO;
	estado: string;
	fechaCreacion: Date;
	fechaSubida?: Date; //posiblemente no
	fechaValidacion?: Date; //posiblemente no
	fechaValidacionDobleChequeo?: Date;
	isAutoValidacion?: boolean;
	isConCuadrilla?: boolean;
	isParticipantesCruzados?: boolean;
	isPlanDeAccion: boolean;
	pdf?: any; //--> preguntar //es de tipo archivo
	respuestasMalas: RESPUESTA[];
	respuestasMalasChildren: RESPUESTA[];
	seccionesRespuestas: SECCIONRESP;
	seccionesRespuestasChildren: SECCIONRESP;
	seccionesRespuestasValidacion: SECCIONRESP;
	validadPor?: AUTH;
	validadoDobleChequeoPor?: AUTH;
	vistos?: any;
	//metodo para verificar emisor retorna un booleano

	//metodos de documento
	needPlanDeAccion ():boolean;
	needValidacion(): boolean;
	DocumentoConProblemas(): boolean;

}
