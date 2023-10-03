import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

admin.initializeApp();
const db = admin.firestore();

export const conta3 = functions.firestore.document('empresas/{cliente}/documentos/{id}')
.onCreate(async (snapshot, context) => {
    const documentID = context.params.id;
    const cliente = context.params.cliente;
    try {
        // Obtener la referencia al documento de la empresa
        const empresaRef = getFirestore().doc(`empresas/${cliente}`);
        
        // Verificar si la empresa existe
        const empresaDoc = await empresaRef.get();
        if (!empresaDoc.exists) {
            console.error(`La empresa ${cliente} no existe.`);
            return null;
        }
        
        // Actualizar el contador en el documento de la empresa
        // const increment = admin.firestore.FieldValue.increment(1);
        await empresaRef.update({
            contador: FieldValue.increment(1),
});
        console.log(`La id del documento es ${documentID}`);
    } catch (error) {
        console.error("Error al actualizar el contador:", error);
    }
    return null;
});


export const agregar = functions.https.onRequest(async (req, res) => {
    try {
        // Crear o actualizar la empresa llamada "vaku"
        const empresaRef = db.collection('empresas').doc('vaku');
        await empresaRef.set({
            // Agrega aquí cualquier dato inicial que quieras para "vaku"
        });

        // Crear una subcolección "documentos" para "vaku"
        const documentoRef = empresaRef.collection('documentos').doc();
        await documentoRef.set({
        // Agrega aquí cualquier dato inicial que quieras para el documento
        });

        res.send('Empresa "vaku" y su colección "documentos" creados con éxito!');
    } catch (error) {
        console.error('Error creando la empresa y su colección:', error);
        res.status(500).send('Ocurrió un error al crear la empresa y su colección.');
    }
});
