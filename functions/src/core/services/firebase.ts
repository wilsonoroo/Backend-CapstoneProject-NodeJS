import {getDatabase} from 'firebase-admin/database'
// import * as serviceAccount from "./akrom.json";

import {initializeApp} from 'firebase-admin/app'

export function initFirebase() {
	return initializeApp()
}
export const db = getDatabase()
