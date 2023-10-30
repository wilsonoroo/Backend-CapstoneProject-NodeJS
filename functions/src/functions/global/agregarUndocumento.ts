import { https, Request, Response } from 'firebase-functions';
import { FirestoreRepository } from '../../core/services/repository/FirestoreRepository';


export const agregarDocumento = https.onRequest(async (req: Request, res: Response) => {


  // Estado predeterminado del documento
  
  const cuadrillaPredeterminada = {
    integrantes: {
      user11: {
        nombre: "wilson"
      },
      user21:{
        nombre: "miguel"
      }
    }
  };
  
  const emisorPredeterminado = {
    id: "user11"
  };

  const estadoDelDocumento = "pendiente_validar";

  const documento = {
    cuadrilla: cuadrillaPredeterminada,
    emisor: emisorPredeterminado,
    estado: estadoDelDocumento
  };

  const repository = new FirestoreRepository('empresas/VAKU/gerencias/gerencia-1/divisiones/division-1/documentos');

  // Agregar documento a Firestore
  try {
    await repository.addDocumentById('doc5', documento);
    res.status(200).send({ success: true, message: 'Documento agregado con éxito' });
  } catch (error) {
    console.error('Error agregando el documento:', error);
    res.status(500).send('Error interno del servidor');
  }
});
