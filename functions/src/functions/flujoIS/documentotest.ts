import { https, Request, Response } from 'firebase-functions';
import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';


export const agregarDocumento = https.onRequest(async (req: Request, res: Response) => {


  // Estado predeterminado del documento
  
  const cuadrillaPredeterminada = {
    integrantes: {
      userTest1: {
        nombre: "wilson",
        isFirmado: false
      },
      userTest2:{
        nombre: "miguel",
        isFirmado: true
      }
    },
    validadores: {
        userValidador1: {
            nombre: "jose",
            isFirmado: false
        },
    }
  };
  const checklistPredeterminado = {
    abreviatura: "IS"
  }
  
  const emisorPredeterminado = {
    id: "emisor1"
  };

  const estadoDelDocumento = "generado";

  const documento = {
    cuadrilla: cuadrillaPredeterminada,
    emisor: emisorPredeterminado,
    estado: estadoDelDocumento,
    checklist: checklistPredeterminado,
  };

  const repository = new FirestoreRepository('empresas/VAKU/gerencias/gerencia-1/divisiones/division-1/documentosRespaldo');

  // Agregar documento a Firestore
  try {
    await repository.addDocumentById('docRespaldoTest', documento);
    res.status(200).send({ success: true, message: 'Documento agregado con éxito' });
  } catch (error) {
    console.error('Error agregando el documento:', error);
    res.status(500).send('Error interno del servidor');
  }
});
