import { onRequest } from "firebase-functions/v2/https";
import { Documento, User } from "../../core/models";
import { FirestoreRepository } from "../../core/services/repository/FirestoreRepository";

export function crearDoc(): Documento {
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

    ///CUADRILLA
    // doc.cuadrilla = [];
    // doc.cuadrilla = new Map();
    // const cuadrilla1 = new Cuadrilla();
    // cuadrilla1.integrantes = [];
    // cuadrilla1.validadores = [];
    //  // Añadir integrantes
    //  const integrante1 = new Integrante();
    //  integrante1.nombre = "Juan";
    //  integrante1.isFirmado = false;
     
    //  const integrante2 = new Integrante();
    //  integrante2.nombre = "Maria";
    //  integrante2.isFirmado = true;
     
    //  cuadrilla1.integrantes.push(integrante1, integrante2);

    //  // Añadir validadores
    // const validador1 = new Integrante();
    // validador1.nombre = "Pedro";
    // validador1.isFirmado = true;

    // const validador2 = new Integrante();
    // validador2.nombre = "Luisa";
    // validador2.isFirmado = false;

    // cuadrilla1.validadores.push(validador1, validador2);
	
	return doc
}


import {Request, Response} from 'firebase-functions'
export const generarDoc =onRequest(async (request: Request, response: Response) => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc2 = crearDoc();
   

    //pasarle un set al repo 

    try {
        await repo.addDocumentById(doc2.id, JSON.parse(JSON.stringify(doc2)));
        console.log("Se agregó el documento de manera correcta dentro de la bd");
  

        // response.send('Se agregó el documento y las respuestas malas correctamente');
    } catch (error) {
        console.error(error);
        // response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});