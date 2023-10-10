import {IRespuesta} from '../../interface'
import { Cuadrilla } from '../cuadrilla'

export class Respuesta implements IRespuesta<any> {
    push(cuadrilla1: Cuadrilla) {
        throw new Error("Method not implemented.")
    }
	id: string
	contenido: string
	titulo: string
	tipo: string
	index: number
	isRequired: boolean
	seccionId: string
	observacion: string
	imagenes: any
}
