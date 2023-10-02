//const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
//const {onDocumentCreated} = require("firebase-functions/v2/firestore");
//const {getFirestore} = require("firebase-admin/firestore");
import { Request, Response } from 'firebase-functions';

export const updatear = onRequest(async (req:Request, res: Response) => {
    //console.log("Siiiiiiiiii sali en la terminal");

    res.json({result: `estoy updatenado`});
  });