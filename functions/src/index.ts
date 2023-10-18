import {
	FlujoActualizarPDF,
	GenerarDocumento,
	myfunction,
	myfunctionk,
} from './functions'

// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";

initializeApp();


// export const generarArchivoPRueba = archivotest;//generar archivo de prueba
export const flujoActualizarDocumento = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
export const contadorPorUsuarioDistribuido = myfunctionk;
export const flujoIS = myfunction;