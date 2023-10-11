// import {
	// flujo3, 
	// myfunction,
	// flujo, 
	// flujo1, 
// } from './functions'
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { initCounter, incrementCounterBy, getCounterValue } from './functions/flujoIS/contadorDistribuido';  // Asegúrate de cambiar a la ruta correcta
import { myfunctionk } from './functions/flujoIS/test1';

admin.initializeApp();
const db = firestore();



export const contando = myfunctionk;
// export const salu2 = flujo;
// export const salve = flujo1;

// export const notification = flujo3;

export const getValueMY = functions.https.onRequest(async (request, response) => {
	const value = await getCounterValue(db, "documentos/contador");
    response.send(`Counter value: ${value}`);
});