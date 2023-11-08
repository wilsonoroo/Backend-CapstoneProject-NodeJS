import {IDocumento} from '../../interface'
import { Archivo } from '../archivo'
import {Checklist} from '../checklist'
import { Cuadrilla } from '../cuadrilla'
import {Encabezado} from '../encabezado'
import { Integrante } from '../integrante'
import {Respuesta} from '../respuesta'
import {SeccionRespuesta} from '../seccionRespuesta'
import {User} from '../usuario'

export class Documento implements IDocumento< Integrante, User,Cuadrilla, Checklist, Encabezado, SeccionRespuesta, Respuesta,Archivo> {
	id: string;
	checklist: Checklist;
	checklistChildren: Checklist|null;
	correlativo?: string|null;
	cuadrilla?: Cuadrilla|null; 
	emisor: Integrante;
	encabezado: Encabezado;
	estado: string;
	fechaCreacion: Date;
	fechaSubida?: Date; 
	fechaValidacion?: Date|null; 
	fechaValidacionDobleChequeo?: Date| null;
	isAutoValidado?: boolean|null;
	isConCuadrilla?: boolean|null;
	isParticipantesCruzados?: boolean|null;
	isPlanDeAccion: boolean|null;
	pdf?: Archivo|null; 
	respuestasMalas: Respuesta[];
	respuestasMalasChildren: Respuesta[]; 
	seccionesRespuestas: SeccionRespuesta;
	seccionesRespuestasChildren: SeccionRespuesta|null;
	seccionesRespuestasValidacion: SeccionRespuesta|null;
	validadPor?: User|null;
	validadoDobleChequeoPor?: User|null;
	vistos?: any|null;
    before: any

	//ver si el documento necesita plan de accion 
	needPlanDeAccion ():boolean{
		return this.checklist.configuracion.needPlanDeAccion;
	}
	//ver si el documento necesita validacion
	needValidacion(): boolean{
		return this.checklist.configuracion.needValidacion;
	}
	//metodo para saber si un documento tiene problema 
	DocumentoConProblemas(): boolean {
        let hayRespuestasMalas = false;

        // Verifica si respuestasMalas es un objeto y no es nulo
        if (typeof this.respuestasMalas === 'object' && this.respuestasMalas !== null) {
            // Transforma respuestasMalas a un array
            this.respuestasMalas = Object.keys(this.respuestasMalas).map(key => ({
                id: key,
                ...(this.respuestasMalas as { [key: string]: any })[key]
            }));
            // Verifica si hay respuestas malas
            hayRespuestasMalas = this.respuestasMalas.length > 0;
        }

        return hayRespuestasMalas;
    }

	//metodo para transformar las respuestas malas en arreglo
	transformarRespuestasMalas(): any[] {
		// Verifica si respuestasMalas es un objeto y no es nulo
		if (typeof this.respuestasMalas === 'object' && this.respuestasMalas !== null) {
			// Transforma respuestasMalas a un array
			this.respuestasMalas = Object.keys(this.respuestasMalas).map(key => ({
				id: key,
				...(this.respuestasMalas as { [key: string]: any })[key]
			}));
		}

		// Retorna el array transformado
		return this.respuestasMalas;
	}
	//metodo para deTransformar las respuestas malas con esta se genera una estructura mapa dentro de mapas (el cual tiene una id ) y dentro la info
	deTransformarRespuestasMalas(): { [key: string]: Respuesta } {
		const respuestasObj: { [key: string]: Respuesta } = {};

		// Si respuestasMalas no es un arreglo o es un arreglo vacío
		if (!Array.isArray(this.respuestasMalas) || this.respuestasMalas.length === 0) {
			return respuestasObj; // Retorna el objeto vacío de inmediato
		}
		
		// Si respuestasMalas es un arreglo y no es vacío
		this.respuestasMalas.forEach(respuesta => {
			// Usa la id como la clave y también mantenla dentro del objeto.
			respuestasObj[respuesta.id] = respuesta;
		});
		
		return respuestasObj;
	}
}

