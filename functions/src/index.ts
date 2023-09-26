import {initializeApp} from 'firebase-admin/app'
import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
import {onValueCreated} from 'firebase-functions/v2/database'
import {onRequest} from 'firebase-functions/v2/https'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

initializeApp()

export const listener = functions.database.ref('messages/{cliente}').onCreate((snap, context) => {
	const original = snap.val()
	logger.log('listener', context.params.cliente, original)
})

export const makeuppercase = onValueCreated('/empresas/{cliente}/documentos/{id}', (event) => {
	// Grab the current value of what was written to the Realtime Database.
	const original = event.data.val()
	logger.log('Uppercasing', event.params.cliente, original)
})

export const helloWorld = onRequest((request, response) => {
	logger.info('Hello logs!', {structuredData: true})
	response.send('Hello from Firebase!')
})
