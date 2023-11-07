import {
// 	FlujoActualizarPDF,
	GenerarDocumento,
// 	myfunction,
// 	myfunctionk,
} from './functions'

// The Firebase Admin SDK to access Firestore.
// import { escuchando } from './functions/flujoIS/t1';
// import  {flujoPatronDisenoo} from './functions/probandoPatrones';
// import { generarDoc2 } from "./functions";
// import { arboltest } from "./functions/probandoPatrones/arbol";
import { generarDoc, generarPDF } from "./functions/test";
import {   handler } from "./functions/probandoPatrones/arbolesBinarios";
// import { escuchando2 } from "./functions/flujoIS/t2";
// import { agregarDocumento } from "./functions/flujoIS/documentotest";
import {initializeApp} from "firebase-admin/app";
import { generarNuevoDocumento } from './functions/flujoDoc/flujoArbol';
import { actualizarDocumento } from './functions/flujoActualizarPDF/flujoArbolActualizar';
initializeApp({ projectId: "vaku-dev" });


// export const generarArchivoPRueba = archivotest;//generar archivo de prueba
// export const flujoActualizarDocumento = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
// export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
// export const contadorPorUsuarioDistribuido = myfunctionk;
// export const flujoIS = myfunction;

// export const probando = escuchando;
// export const fdiseno= flujoPatronDisenoo;
export const doc = generarDoc;
export const doc2 = GenerarDocumento;
export const pdf =generarPDF;
export const caseuse=handler;
export const flujoGenerarDoc = generarNuevoDocumento;
export const flujoActualizarDoc = actualizarDocumento;


// export const voy = escuchando2;
// export const nuevoDocTest = agregarDocumento;
