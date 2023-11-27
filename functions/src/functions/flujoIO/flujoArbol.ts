import { Documento } from '../../core/models';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { plainToClass } from 'class-transformer';
import { convertDocumentTimestampsToDate } from '../../core/utils';
import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';
import { procesarFlujoIO } from '../../core/caseUse/generarIO';

export const flujoIOArboles = onDocumentWritten("empresas/{idEmpresa}/gerencias/{idGerencia}/divisiones/{idDivision}/documentosRespaldo/{docId}", async(event) => {    
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const dataBefore = snapshot.before.data();
    const dataAfter = snapshot.after.data();
    const transformedDataBefore = convertDocumentTimestampsToDate(dataBefore);
    const transformedDataAfter = convertDocumentTimestampsToDate(dataBefore);
    const docBefore = plainToClass(Documento, transformedDataBefore);
    const docAfter = plainToClass(Documento, transformedDataAfter);

    // Verificar si el documento ha cambiado realmente
    if (JSON.stringify(dataBefore) === JSON.stringify(dataAfter)) {
        return; // No hacer nada si el documento no ha cambiado
    }
    const repo = new FirestoreRepository<Documento>(`empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentosRespaldo`); 
    const newRepo = new FirestoreRepository<Documento>(`empresas/${event.params.idEmpresa}/gerencias/${event.params.idGerencia}/divisiones/${event.params.idDivision}/documentos`); 
    await procesarFlujoIO(docBefore,docAfter,repo,newRepo);
    
});
