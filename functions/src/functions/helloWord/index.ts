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
	repo.getDocument<Documento>('0d96a303aa')
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
export const updata2 = onRequest((request: Request, response: Response) => {
	const doc2 = new Documento()
	doc2.estado = 'en_espera_del_boss'

	const repo = new FirestoreRepository<Documento>('/empresa/id/usuarios')
	repo.updateDocumentParcial<Documento>('id1',JSON.parse(JSON.stringify(doc2))).then((doc) => {
		console.log(doc)
		response.send(doc)
		console.log('update save ok!!')

	}).catch((error) => {
		console.error(error)
	});

})
export const deleteando = onRequest((request: Request, response: Response) => {
	const doc2 = new Documento()
	doc2.estado = 'en_espera_del_boss'

	const repo = new FirestoreRepository<Documento>('/empresa/id/usuarios')
	repo.deleteDocument<Documento>('id2').then((doc) => {
		console.log(doc)
		response.send('deleteado  ok!!')
		console.log('deleteado  oks!!')

	}).catch((error) => {
		console.error(error)
	});

})
export const agregando = onRequest((request: Request, response: Response) => {
	const doc2 = new Documento();
	doc2.id = 'doc2';
	doc2.isConCuadrilla= true;
	doc2.isAutoValidado =true;
	doc2.isPlanDeAccion = true;
	doc2.emisor = new User();
	doc2.emisor.id = 'idUsuarios';
	doc2.emisor.email = 'insetarCorreo.cl';
	doc2.estado = 'generado';

	const repo = new FirestoreRepository<Documento>('/documentos')
	const idAux = doc2.id;
	repo.addDocumentById(idAux,JSON.parse(JSON.stringify(doc2))).then((doc)=> {
		response.send('nuevo save ok!!')
	}).catch((error) => {
		console.error(error)})

})
