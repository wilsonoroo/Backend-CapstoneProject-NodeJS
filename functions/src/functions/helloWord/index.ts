import {logger} from 'firebase-functions'
import {onRequest} from 'firebase-functions/v2/https'
//const {onDocumentCreated} = require("firebase-functions/v2/firestore");
//const {getFirestore} = require("firebase-admin/firestore");
import {Request, Response} from 'firebase-functions'

import {Documento, User} from '../../core/models'
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'

export const helloWorld = onRequest((request: Request, response: Response) => {
	logger.info('Hello logs!', {structuredData: true})

	const repo = new FirestoreRepository<Documento>('documentos')
	const repoGlobal = new FirestoreRepository<Documento>('documentos/0d96a303aa/docGlobal')
	const repoGlobal2 = new FirestoreRepository<Documento>('docGlobal')

	const repoUsuario = new FirestoreRepository<User>('empresa/id/usuarios')
	repo
		.getDocument<Documento>('0d96a303aa')
		.then((doc) => {
			console.log('hola mubndo')

			Promise.all([repoGlobal2.addDocumentById('id1', doc), repoGlobal.addDocumentById('id1', doc)]).then(() => {
				response.send({...doc, dataadd: 'ok'})
			})
		})
		.catch((error) => {
			console.error(error)
		})

	const usuario = new User()
	usuario.id = 'id1'
	usuario.email = '<EMAIL>'
	usuario.empresaId = 'id1'
	usuario.empresa = 'id1'
	usuario.gerenciaId = 'id1'
	usuario.divisionId = 'id1'

	repoUsuario.addDocumentById('id1', JSON.parse(JSON.stringify(usuario))).then(() => {
		console.log('User save ok!!')
	})
	repo.getAlldocuments().then((docs) => {
		console.log(docs)
	})
})
