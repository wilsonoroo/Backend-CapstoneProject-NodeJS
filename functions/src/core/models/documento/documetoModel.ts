import {IDocumento} from '../../interface'
import {Checklist} from '../checklist'
import { Cuadrilla } from '../cuadrilla'
import {Encabezado} from '../encabezado'
import {Respuesta} from '../respuesta'
import {SeccionRespuesta} from '../seccionRespuesta'
import {User} from '../usuario'

export class Documento implements IDocumento<User,Cuadrilla, Checklist, Encabezado, SeccionRespuesta, Respuesta> {
	id: string;
	checklist: Checklist;
	checklistChildren: Checklist;
	correlativo?: string;
	cuadrilla?: Cuadrilla; 
	emisor: User;
	encabezado: Encabezado;
	estado: string;
	fechaCreacion: Date;
	fechaSubida?: Date; //posiblemente no
	fechaValidacion?: Date; //posiblemente no
	fechaValidacionDobleChequeo?: Date;
	isAutoValidado?: boolean;
	isConCuadrilla?: boolean;
	isParticipantesCruzados?: boolean;
	isPlanDeAccion: boolean;
	pdf?: any; //--> preguntar
	respuestasMalas: Respuesta[];
	respuestasMalasChildren: Respuesta; //-->
	seccionesRespuestas: SeccionRespuesta;
	seccionesRespuestasChildren: SeccionRespuesta;
	seccionesRespuestasValidacion: SeccionRespuesta;
	validadPor?: User;
	validadoDobleChequeoPor?: User;
	vistos?: any;
}
