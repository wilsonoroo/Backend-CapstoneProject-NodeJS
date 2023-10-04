import {IRespuesta} from '../../interface'

export class RespuestaModel implements IRespuesta<any> {
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
