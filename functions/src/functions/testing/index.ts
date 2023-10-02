import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
//import { event } from 'firebase-functions/v1/analytics';
import {onValueCreated} from 'firebase-functions/v2/database';
import {onDocumentCreated} from "firebase-functions/v2/firestore";

export const listener2 = onDocumentCreated('messages/{cliente}',() => {
    console.log("Se scucho algo cuidadito")
    logger.log("Listener2");

})



export const listener = functions.database.ref('messages/{cliente}').onCreate((snap, context) => {
	const original = snap.val()
	logger.log('listener', context.params.cliente, original)
})

export const makeuppercase = onValueCreated('/empresas/{cliente}/documentos/{id}', (event) => {
	// Grab the current value of what was written to the Realtime Database.
	const original = event.data.val()
	logger.log('Uppercasing', event.params.cliente, original)
})
