import * as logger from 'firebase-functions/logger'
import {onValueCreated} from 'firebase-functions/v2/database'

export const funcionv2 = onValueCreated('empresas/{cliente}', (event) => {
	// Grab the current value of what was written to the Realtime Database.
	const original = event.data.val()
	logger.log('Uppercasing', event.params.cliente, original)
})
