import {getDatabase} from 'firebase-admin/database'
// import * as serviceAccount from "./akrom.json";

import * as admin from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'
import serviceAccountDev from './dev.json'

export function initFirebase() {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccountDev as admin.ServiceAccount),
	})
	return initializeApp()
}
export const db = getDatabase()
