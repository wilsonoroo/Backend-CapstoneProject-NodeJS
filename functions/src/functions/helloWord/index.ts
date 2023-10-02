import {logger} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
//const {onDocumentCreated} = require("firebase-functions/v2/firestore");
//const {getFirestore} = require("firebase-admin/firestore");
import { Request, Response } from 'firebase-functions';

export const helloWorld = onRequest((request:Request, response:Response) => {
	logger.info('Hello logs!', {structuredData: true})
	response.send('Hello from Firebase!')
})
