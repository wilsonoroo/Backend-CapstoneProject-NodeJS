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


export const generaDocumentoNuevo = generarDoc;//genera Doc
export const ARCHOTEST = archivotest;//genera Doc
export const flujoN = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
export const notification = flujo3;
export const is2 = myfunction;
export const nombre= obtenerNombres;