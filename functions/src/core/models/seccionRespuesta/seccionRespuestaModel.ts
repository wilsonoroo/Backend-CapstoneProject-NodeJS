import {ISeccionRespuesta} from '../../interface'
import {Fotografia} from '../fotografia'
import {Respuesta} from '../respuesta'
export class SeccionRespuesta implements ISeccionRespuesta<Respuesta, Fotografia> {
	id: string
	nombre: string
	index: number
	padre?: string
	instruccion: string
	isPaginate: boolean
	cantidad: number
	respuestas: Respuesta
	imagenReferencia: Fotografia
}
