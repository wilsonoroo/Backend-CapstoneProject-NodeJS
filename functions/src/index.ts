// import {
	// flujo3, 
	// myfunction,
	// flujo, 
	// flujo1, 
// } from './functions'
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { 
	// initCounter, 
	// incrementCounterBy, 
	getCounterValue } from './functions/flujoIS/contadorDistribuido';  // Asegúrate de cambiar a la ruta correcta
// import { myfunctionk } from './functions/flujoIS/test1';
// import { myfunctionk1 } from './functions/flujoIS/test2';
import { myfunction } from './functions';

admin.initializeApp();
const db = firestore();



// export const contando = myfunctionk;
// export const contando1 = myfunctionk1;
export const IS = myfunction;
// export const salu2 = flujo;
// export const salve = flujo1;

// export const notification = flujo3;

export const getValueMY = functions.https.onRequest(async (request, response) => {
	const value = await getCounterValue(db, "documentos/contador");
    response.send(`Counter value: ${value}`);
});

export const getValueMY1 = functions.https.onRequest(async (request, response) => {
    // Tomar el estado desde el parámetro de la solicitud
    const estado = "generado";


    if (!estado) {
        response.status(400).send('Por favor, proporciona un estado en la query string.');
        return;
    }

    // Construir la ruta al contador usando el estado
    const getRootPath = (estado: string) => `contadores/count_${estado}`;
    const rootPath = getRootPath(estado);

    // Obtener el valor del contador
    const value = await getCounterValue(db, rootPath);

    response.send(`Counter value  estado "${estado}": ${value}`);
});