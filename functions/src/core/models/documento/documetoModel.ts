import {IDocumento} from '../../interface'
import {Checklist} from '../checklist'
import {Encabezado} from '../encabezado'
import {RespuestaModel} from '../respuesta'
import {SeccionRespuesta} from '../seccionRespuesta'
import {User} from '../usuario'
//import { respuestaModel } from "../respuesta";

export class Documento implements IDocumento<User, Checklist, Encabezado, SeccionRespuesta, RespuestaModel> {
	id: string
	encabezado: Encabezado
	seccionesRespuestas: SeccionRespuesta
	emisor: User
	seccionesRespuestasValidacion: SeccionRespuesta
	seccionesRespuestasChildren: SeccionRespuesta
	fechaCreacion: Date
	fechaSubida?: Date
	fechaValidacion?: Date
	estado: string
	isPlanDeAccion: boolean
	respuestasMalas: RespuestaModel
	checklist: Checklist
	pdf?: any //--> preguntar
	vistos?: any // que tipo de dato es el vistos  -->preguntar
	checklistChildren: Checklist
	respuestasMalasChildren: RespuestaModel
	dobleValidadorPor: User
}
