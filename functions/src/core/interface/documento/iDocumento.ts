export interface IDocumento<AUTH,CUADRILLA, CHECKLIST, ENCABEZADO, SECCIONRESP, RESPUESTA,ARCHIVO> {
	id: string;
	checklist: CHECKLIST;
	checklistChildren: CHECKLIST;
	correlativo?: string;
	cuadrilla?: CUADRILLA; 
	emisor: AUTH;
	encabezado: ENCABEZADO;
	estado: string;
	fechaCreacion: Date;
	fechaSubida?: Date; 
	fechaValidacion?: Date; 
	fechaValidacionDobleChequeo?: Date;
	isAutoValidacion?: boolean;
	isConCuadrilla?: boolean;
	isParticipantesCruzados?: boolean;
	isPlanDeAccion: boolean;
	pdf?: ARCHIVO; 
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
