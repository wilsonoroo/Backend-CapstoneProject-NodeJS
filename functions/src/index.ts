import {
	FlujoActualizarPDF,
	GenerarDocumento,
	// flujo3, 
	myfunction,
	archivotest,
} from './functions'

// import { 
// 	// initCounter, 
// 	// incrementCounterBy, 
// 	getCounterValue } from './functions/flujoIS/contadorDistribuido'; 
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

initializeApp();


export const generarArchivoPRueba = archivotest;//genera Doc
export const flujoActualizarDocumento = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
// export const notification = flujo3;
export const is2 = myfunction;