import {
	generarDoc,
	FlujoActualizarPDF,
	GenerarDocumento,
} from './functions'
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

initializeApp();


export const generaDocumentoNuevo = generarDoc;//genera Doc
export const flujoN = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento