import {plainToClassFromExist} from 'class-transformer'

import {UsuarioRespuesta} from '../models'
import {BibliotecaDocumentos} from '../models/biblioteca/bibliotecaDocumento'
import {Documento, EstadoDocumento} from '../models/check_list/documento.model'
import {InstructivoSeguridad} from '../models/check_list/instructivoSeguridad'
import {PdfCreator} from '../models/pdfCreator/pdfCreator'
import {User} from '../models/user/user.model'
import {db} from '../services'

const ref = db.ref('/empresas')

export async function procesarInstructivoDeSeguridad(documentoVaku: Documento, cliente: string): Promise<void> {
	const isVaku = new InstructivoSeguridad(documentoVaku)
	const contineValidadores = isVaku.tieneValidadores()

	let validadores = Array<User>()
	if (isVaku.estado === EstadoDocumento.PendienteValidar) {
		if (!contineValidadores) {
			// validadores = getValidadoresPorTurno(documentoVaku.getTurnoValidador());

			validadores = await getValidadoresPorTurno(cliente, isVaku.getTurnoEmisor())
		} else {
			validadores = getValidadores(cliente)
		}
		if (validadores !== null && validadores.length !== 0) {
			validadores.forEach((validador: User) => {
				validador.sendNotificacionFirma(isVaku.getTypeDocumento(), cliente)
			})
		}
	} else if (isVaku.estado === EstadoDocumento.Validado || isVaku.estado === EstadoDocumento.Rechazado) {
		// EnkiCreator nombre del procesador de documentos
		let documentoFinalizado = null
		try {
			documentoFinalizado = createPdf(documentoVaku, cliente)
			// isVaku.createPdf()
			documentoFinalizado.cuadrilla.integrantes.forEach((integrante) => {
				const usuarioRespuesta = new UsuarioRespuesta(integrante.id)
				usuarioRespuesta.addDoc(usuarioRespuesta)
				usuarioRespuesta.upDate()
				usuarioRespuesta.sendNotificacionISGenerada()
			})
			const bibliotecaDeDocumentos = new BibliotecaDocumentos()
			bibliotecaDeDocumentos.addDoc(documentoFinalizado)
		} catch (error) {
			documentoFinalizado = documentoVaku
		}

		return Promise.resolve(undefined)
	}
}

export function procesarCheckList(documentoVaku: Documento, cliente: string): void {
	if (documentoVaku.needValidacion()) {
		if (!documentoVaku.getConfigValidacion()) {
			if (documentoVaku.tieneRespuestasMalas()) {
				documentoVaku.setEstado(EstadoDocumento.DocConProblemas)
			} else {
				documentoVaku.setEstado(EstadoDocumento.DocSinProblemas)
			}

			const validadores = getValidadores(cliente)

			const planificadores = getPlanificadores(cliente)
			validadores.forEach((validador) => {
				validador.sendNotificacionParaValidar()
				validador.addNotificacionDocumento()
			})
			planificadores.forEach((planificador) => {
				planificador.sendNotificacionParaValidar()
				planificador.addNotificacionDocumento()
			})
		} else {
			try {
				const documentoFinalizado = createPdf(documentoVaku, cliente)
				console.log(documentoFinalizado)
			} catch (error) {
				console.log(error)
			}
		}
	}
}

function createPdf(documentoVaku: Documento, cliente: string): Documento {
	const correlativo = getCorrelativo(cliente)

	// EnkiCreator nombre del procesador de documentos
	const pdf = PdfCreator.generate(documentoVaku)
	if (pdf !== null) {
		documentoVaku.setCorrelativo(correlativo)
		console.log(getDateNowString())
		documentoVaku.setFechaSubida(getDateNow())
		documentoVaku.setPdf(pdf)
		if (documentoVaku.getEstado() === EstadoDocumento.Validado) {
			documentoVaku.setEstado(EstadoDocumento.Finalizado)
		}
		documentoVaku.upDate()
		return documentoVaku
	}
	throw new Error('Error en creacion de pdf')
}

function getDateNowString(): string {
	return new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '')
}
function getDateNow(): Date {
	return new Date(Date.now())
}

async function getValidadoresPorTurno(cliente: string, turno: string): Promise<Array<User>> {
	// sendNotificacionMulticast(null, null);

	// / TODO extraer dataen repositorio
	const result = await ref.child(`${cliente}/usuarios/validadores`).get()
	const array: Array<User> = []
	if (result.exists()) {
		result.forEach((children) => {
			const user = new User(children.key)
			const userMerge = plainToClassFromExist(user, children.val())
			if (userMerge.turno !== undefined && userMerge.turno === turno) {
				array.push(userMerge)
			}
		})
	}
	return array
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getValidadores(_cliente: string): Array<User> {
	throw new Error('Method not implemented.')
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPlanificadores(_cliente: string): Array<User> {
	throw new Error('Method not implemented.')
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCorrelativo(_cliente: string): string {
	throw new Error('Method not implemented.')
}
