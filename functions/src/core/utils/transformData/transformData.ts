import { Timestamp } from "firebase-admin/firestore";



export function convertDocumentTimestampsToDate(document: any): any {
    for (let key in document) {
        if (document[key] instanceof Timestamp) {
            document[key] = document[key].toDate();
        }
    }
    return document;
}