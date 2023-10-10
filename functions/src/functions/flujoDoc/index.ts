import {Documento,} from '../../core/models'
import {FirestoreRepository} from '../../core/services/repository/FirestoreRepository'
import { EnkiCreator } from '../../core/services/enkiCreator/enkiCreator';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

export const GenerarDocumento = onDocumentUpdated("/documentos/{docId}", async(event)  => {
    const rutaDoc = '/documentos';
    const repo = new FirestoreRepository<Documento>(rutaDoc);
    const doc = event.data?.after.data() as Documento;
    
    const needValidacion = doc.checklist.configuracion.needValidacion;
    const needPlanDeAccion = doc.checklist.configuracion.needPlanDeAccion;
    const conProblemas = doc.respuestasMalas.length;

    if(!needValidacion){
        //no necesita validacion
        //generarPDF --> servicio
        doc.pdf =EnkiCreator.generarPDF(doc)

        console.log(`documento fue validado y enviado a  ${doc.emisor.email}`)
        doc.estado = 'validado';
        repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));

        if(needPlanDeAccion){
            doc.estado = 'finalizado_con_plan_accion';
            repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));
        }
        else{
            doc.estado = 'finalizado';
            repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));
        }
    }else{
        if(conProblemas > 0){
            doc.estado = 'doc_con_problemas';
            repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));
            //enviar notificacion

        }
        else{
            doc.estado = 'doc_sin_problemas';
            repo.updateDocument(doc.id, JSON.parse(JSON.stringify(doc)));
            //enviaar notificacion
        }
    }

});

