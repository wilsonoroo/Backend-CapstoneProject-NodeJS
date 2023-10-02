import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
export const conta2 =  functions.firestore.document('empresas/{cliente}/documentos/{id}')
.onCreate(async(snapshot,context)=>{
    const documentID = context.params.id;
    const cliente= context.params.cliente;
    try{
        //obtener la referencia al documento de la empresa
        const empresaRef = getFirestore().doc(`empresas/${cliente}`);
        //verificar si la empresa existe
        const empresaDoc = await empresaRef.get();
        if (!empresaDoc.exists){
            console.error(`La empresa ${cliente} no existe.`);
            return null;
        }
        //Obtener el contador actual de la empresa 
        const currentCount = empresaDoc.data()?.contador || 0;
        //Incrementar el contador 
        const newCount =currentCount+1;
        //actualizar el contador en el documento de la empresa
        await empresaRef.update({contador: newCount});
        console.log(`La id del documento es ${documentID}`);
    }catch(error){
        console.error("Errror al actualizar el cintador:",error);
    }
    return null;
});