export interface IDocumento<INTEGRANTE,AUTH,CUADRILLA, CHECKLIST, ENCABEZADO, SECCIONRESP, RESPUESTA,ARCHIVO> {
	id: string;
	checklist: CHECKLIST;
	checklistChildren: CHECKLIST|null;
	correlativo?: string|null;
	cuadrilla?: CUADRILLA|null; 
	emisor: INTEGRANTE;
	encabezado: ENCABEZADO;
	estado: string;
	fechaCreacion: Date;
	fechaSubida?: Date; 
	fechaValidacion?: Date|null; 
	fechaValidacionDobleChequeo?: Date|null;
	isAutoValidacion?: boolean|null;
	isConCuadrilla?: boolean|null;
	isParticipantesCruzados?: boolean|null;
	isPlanDeAccion: boolean|null;
	pdf?: ARCHIVO|null; 
	respuestasMalas: RESPUESTA[];
	respuestasMalasChildren: RESPUESTA[];
	seccionesRespuestas: SECCIONRESP;
	seccionesRespuestasChildren: SECCIONRESP|null;
	seccionesRespuestasValidacion: SECCIONRESP|null;
	validadPor?: AUTH|null;
	validadoDobleChequeoPor?: AUTH|null;
	vistos?: any|null;
	//metodo para verificar emisor retorna un booleano

	//metodos de documento
	needPlanDeAccion ():boolean;
	needValidacion(): boolean;
	DocumentoConProblemas(): boolean;

}
