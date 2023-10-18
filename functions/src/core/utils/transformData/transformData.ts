import { Timestamp } from "firebase-admin/firestore";



export function convertDocumentTimestampsToDate(document: any): any {
    for (let key in document) {
        // Si es un objeto Timestamp, convierte a Date
        if (document[key] instanceof Timestamp) {
            document[key] = document[key].toDate();
        }
        // Si es un objeto (como un map) y no es un Timestamp, revisa recursivamente
        else if (typeof document[key] === 'object' && document[key] !== null) {
            document[key] = convertDocumentTimestampsToDate(document[key]);
        }
    }
    return document;
}

export function convertDocumentDatesToTimestamps(document: any): any {
    for (let key in document) {
        // Si es un objeto Date, convierte a Timestamp
        if (document[key] instanceof Date) {
            document[key] = Timestamp.fromDate(document[key]);
        }
        // Si es un objeto (como un map) y no es una Date, revisa recursivamente
        else if (typeof document[key] === 'object' && document[key] !== null) {
            document[key] = convertDocumentDatesToTimestamps(document[key]);
        }
    }
    return document;
}