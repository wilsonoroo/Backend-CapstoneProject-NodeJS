import {
	FlujoActualizarPDF,
	GenerarDocumento,
	// flujo3, 
	myfunction,
	archivotest,
} from './functions'
import { myfunctionk } from './functions/flujoIS/test1';

// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";

initializeApp();


export const generarArchivoPRueba = archivotest;//generar archivo de prueba
export const flujoActualizarDocumento = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
export const contando = myfunctionk;
export const IS = myfunction;
