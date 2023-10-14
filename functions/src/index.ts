import {
	generarDoc,
	FlujoActualizarPDF,
	GenerarDocumento,
	flujo3, 
	myfunction,
	archivotest,
	obtenerNombres,
} from './functions'
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

initializeApp();


export const generaDocumentoNuevo = generarDoc;//genera Doc de prueba // aqui las respuestas malas son de tipo array dentro de la bd por lo que  no funcionaria el metodo de conProblema
export const generarArchivoPRueba = archivotest;//genera Doc
export const flujoActualizarDocumento = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
export const notification = flujo3;
export const is2 = myfunction;
export const nombre= obtenerNombres;