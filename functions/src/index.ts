import {
	generarDoc,
	FlujoActualizarPDF,
	GenerarDocumento,
	// flujo3, 
	myfunction,
	archivotest,
	obtenerNombres,

} from './functions'

// import { 
// 	// initCounter, 
// 	// incrementCounterBy, 
// 	getCounterValue } from './functions/flujoIS/contadorDistribuido'; 
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

initializeApp();


export const generaDocumentoNuevo = generarDoc;//genera Doc
export const ARCHOTEST = archivotest;//genera Doc
export const flujoN = FlujoActualizarPDF;//flujo para cuando se actualiza un documento
export const flujoGenerarDoc = GenerarDocumento;//flujo para cuando se actualiza un documento
// export const notification = flujo3;
export const is2 = myfunction;
export const nombre= obtenerNombres;


// export const getValueMY = functions.https.onRequest(async (request, response) => {
// 	const value = await getCounterValue(db, "documentos/contador");
//     response.send(`Counter value: ${value}`);
// });

// export const getValueMY1 = functions.https.onRequest(async (request, response) => {
//     // Tomar el estado desde el parámetro de la solicitud
//     const estado = "generado";


//     if (!estado) {
//         response.status(400).send('Por favor, proporciona un estado en la query string.');
//         return;
//     }

//     // Construir la ruta al contador usando el estado
//     const getRootPath = (estado: string) => `contadores/count_${estado}`;
//     const rootPath = getRootPath(estado);

//     // Obtener el valor del contador
//     const value = await getCounterValue(db, rootPath);

//     response.send(`Counter value  estado "${estado}": ${value}`);
// });
