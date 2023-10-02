import * as functions from 'firebase-functions';
export declare const listener2: import("firebase-functions/lib/v2/core").CloudFunction<import("firebase-functions/v2/firestore").FirestoreEvent<import("firebase-functions/v2/firestore").QueryDocumentSnapshot | undefined, {
    cliente: string;
}>>;
export declare const listener: functions.CloudFunction<functions.database.DataSnapshot>;
export declare const makeuppercase: import("firebase-functions/lib/v2/core").CloudFunction<import("firebase-functions/v2/database").DatabaseEvent<functions.database.DataSnapshot, {
    cliente: string;
    id: string;
}>>;
//# sourceMappingURL=index.d.ts.map