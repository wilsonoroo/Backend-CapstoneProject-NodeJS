import * as logger from 'firebase-functions/logger';
import {onValueCreated} from 'firebase-functions/v2/database';
//const functions = require('firebase-functions/v2');
import {onDocumentCreated} from "firebase-functions/v2/firestore";

import {
	//Documento,
	//procesarCheckList,
	//procesarInstructivoDeSeguridad,
	//TipoDocumento,
  } from "../../core";
import { Documentos } from '../../core/models/check_list/documentos.model';
 import { plainToClassFromExist } from "class-transformer";


export const funcionv2 = onValueCreated('empresas/{cliente}', (event) => {
	// Grab the current value of what was written to the Realtime Database.
	const original = event.data.val()
	logger.log('Uppercasing', event.params.cliente, original)
});
// export const onCreateNewDocument = functions.firestore
// 							.document('empresas/{cliente}/documentos{id}')
// 							.onCreate((snapshot,context)=>{
// 								const documentData = snapshot.data();
// 								const documentId = context.params.id;
// 								console.log('Nuevo documento creado en la ruta/${documentId}:',documentData)
// });

export const onCreateNewDocument2 = onDocumentCreated('empresas/{cliente}/documentos/{id}',(event)=>{
								//empresas es una coleccion
								// cliente es un document id 
								// documentos es otra coleccion
								// id es el document id de documentos
								// el event.params.{algo dentro de la ruta} se refiere al valor real que se va a usar
								//ejemplo Nuevo documento para la Empresa vaku-dev creado en la ruta: id_1_de_documentos_vaku
								//en el ejemplo se tiene que vaku-dev viene de {cliente} y id_1_de_documentos_vaku viene de {id}
								//En el caso de event.data?.data() traigo todo los datos de la ruta especificada (los valores del final de la ruta)
							
								const documentData = event.data?.data();//obtengo los datos dentro de la coleccion, me regresa un json con todos los datos
								const documentId = event.params.id; // document id dentro de la base de datos
								const nombreEmpresa = event.params.cliente;
								console.log(`Nuevo documento para la Empresa ${nombreEmpresa} creado en la ruta: ${documentId}:`,documentData);
								logger.log("Escuchando el nuevo documento creado mostrar si funciona es un texto largisimo xdddddd");

});
export const funcionTesting1 = onDocumentCreated('empresas/{cliente}/documentos/{id}',(event)=>{
	const cliente = event.params.cliente;
	const documentoVakuAux = new Documentos();
	documentoVakuAux.id = '1';
	const documentoData = event.data?.data();
	//const documentoVaku = plainToClass(Documentos, documentoData);

	//documentoVakuAux.id = event.params.id;
    const documentoVaku = plainToClassFromExist(
       documentoVakuAux,
       documentoData
	);
	//const obtenerRut = documentoVaku.getRut();

	console.log(cliente,"---------");
	console.log(documentoVaku.emisor);
	console.log("El cargo es: ", documentoVaku.emisor.cargo);
});