// import {
// 	FlujoActualizarPDF,
// 	GenerarDocumento,
// 	myfunction,
// 	myfunctionk,
// } from './functions'

// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";
// import { escuchando } from './functions/flujoIS/t1';
// import  {flujoPatronDisenoo} from './functions/probandoPatrones';
// import { generarDoc } from "./functions";
import { arboltest } from "./functions/probandoPatrones/arbol";
import { generarDoc } from "./functions/test";
import {  handler } from "./functions/probandoPatrones/arbolesBinarios";
initializeApp();


// export const generarArchivoPRueba = archivotest;//generar archivo de prueba
// export const flujoActualizarDocumento = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
// export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
// export const contadorPorUsuarioDistribuido = myfunctionk;
// export const flujoIS = myfunction;

// export const probando = escuchando;
// export const fdiseno= flujoPatronDisenoo;
export const doc = generarDoc;
export const arbol = arboltest;
// export const flujo = flujoHandler;
export const caseuse=handler;