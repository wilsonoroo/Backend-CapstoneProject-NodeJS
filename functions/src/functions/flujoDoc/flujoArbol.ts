import { Documento } from '../../core/models';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { plainToClass } from 'class-transformer';
import { convertDocumentTimestampsToDate } from '../../core/utils';
import { procesarDocumentoFlujoGenerar } from '../../core/caseUse/generarDoc';
import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';

export const generarNuevoDocumento = onDocumentCreated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {
    const data = event.data?.data();
    const transformedData = convertDocumentTimestampsToDate(data);
    const doc = plainToClass(Documento, transformedData);
    console.log("--------caso de uso ----->");
    const rutaDoc = `empresas/${event.params.nombreEmpresa}/gerencias/${event.params.nombreGerencia}/divisiones/${event.params.nombreDivision}/documentos`;
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const empresa = event.params.nombreEmpresa;
    procesarDocumentoFlujoGenerar(doc,repo,empresa);
})
