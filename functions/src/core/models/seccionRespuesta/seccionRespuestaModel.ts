import {ISeccionRespuesta} from '../../interface'

import {Fotografia} from '../fotografia'
import {RespuestaModel} from '../respuesta'
export class SeccionRespuesta implements ISeccionRespuesta<RespuestaModel, Fotografia> {
	id: string
	nombre: string
	index: number
	padre?: string
	instruccion: string
	isPaginate: boolean
	cantidad: number
	respuestas: RespuestaModel
	imagenReferencia: Fotografia
}
