import {logger} from 'firebase-functions'
import {onRequest} from 'firebase-functions/v2/https'
//const {onDocumentCreated} = require("firebase-functions/v2/firestore");
//const {getFirestore} = require("firebase-admin/firestore");
import {Request, Response} from 'firebase-functions'

import {Documento, User, Respuesta,Checklist,ConfiguracionChecklist} from '../../core/models'
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

export const agregarColeccion = onRequest(async (request: Request, response: Response) => {
    const repo = new FirestoreRepository<Documento>('/documentos');
    const doc2 = crearDoc();
	//pasarle un set al repo 

    try {
        await repo.addDocumentById(doc2.id, JSON.parse(JSON.stringify(doc2)));
        console.log("Se agregó el documento de manera correcta dentro de la bd");

        for (let respuestaMala of doc2.respuestasMalas) {
            try {
                await repo.addToCollectionById("RespuestaMalas", JSON.parse(JSON.stringify(respuestaMala)), doc2.id, respuestaMala.id);
                console.log("Se agregó la colección dentro del documento en el for", respuestaMala.id);
				//documentos/id/respuestasMalas/id/RespuestaMalaChildren/id

            } catch (error) {
                console.error("Error agregando respuestaMala:", error);
            }
        }

        response.send('Se agregó el documento y las respuestas malas correctamente');
    } catch (error) {
        console.error(error);
        response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});
function crearDoc(): Documento {
	const user = new User();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = true;
	doc.emisor = user;
	doc.estado = 'generado';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
	configuracion.cantidadMaximaFotos = 10;
	checklist.configuracion = configuracion;	
	doc.checklist = checklist;
	const respuesta1 = new Respuesta();
	respuesta1.id = 'r1';
	respuesta1.contenido = 'contenido1';
	respuesta1.titulo = 'titulo1';
	respuesta1.tipo = 'tipo1';
	const respuesta2 = new Respuesta();
	respuesta2.id = 'r2';
	respuesta2.contenido = 'contenido2';
	respuesta2.titulo = 'titulo2';
	respuesta2.tipo = 'tipo2';
	const respuesta3 = new Respuesta();
	respuesta3.id = 'r3';
	respuesta3.contenido = 'contenido3';
	respuesta3.titulo = 'titulo3';
	respuesta3.tipo = 'tipo3';
	const respuestaC1 = new Respuesta();
	respuestaC1.id = 'rChiquita1';
	respuestaC1.contenido = 'contenidoChito1';
	respuestaC1.titulo = 'tituloChiquito1';
	respuestaC1.tipo = 'tipoChiquito1';
	const respuestaC2 = new Respuesta();
	respuestaC2.id = 'rChiquita2';
	respuestaC2.contenido = 'contenidoChito2';
	respuestaC2.titulo = 'tituloChiquito2';
	respuestaC2.tipo = 'tipoChiquito2';
	doc.respuestasMalas.push(respuesta1,respuesta2,respuesta3);
	doc.respuestasMalasChildren.push(respuestaC1,respuestaC2);
	
	
	return doc
}
