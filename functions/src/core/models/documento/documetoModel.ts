import { IDocumento } from "../../interface";
import { firestore } from "firebase-admin"; // Asegúrate de haber instalado e importado el paquete correcto
const db = firestore();
export class Documento implements IDocumento<string,string,string,string,string>{
    id: string;
    encabezado: string;
    seccionesRespuestas: string;
    emisor: string;
    seccionesRespuestasValidacion: string;
    seccionesRespuestasChildren: string;
    fechaCreacion: Date;
    fechaSubida?: Date;
    fechaValidacion?: Date;
    estado: string;
    isPlanDeAccion: boolean;
    respuestasMalas: string;
    checklist: string;
    pdf?:  any; //--> preguntar
    vistos?: any;// que tipo de dato es el vistos  -->preguntar
    checklistChildren:  string;
    respuestasMalasChildren: string;
    dobleValidadorPor: string;

    
  
    
    private collectionRef = db.collection('documentos');

    async add(): Promise<void> {
        try {
            const docRef = await this.collectionRef.add(this);
            this.id = docRef.id; // Establece el ID autogenerado
            console.log("Documento agregado exitosamente con ID:", this.id);
        } catch (error) {
            console.error("Error al agregar el documento:", error);
        }
    }
    //a mi criterio no se necesita actualizar el documento
    async findByID(documentoId: string): Promise<IDocumento<string, string, string, string, string> | null> {
        try {
            const doc = await this.collectionRef.doc(documentoId).get();
            if (doc.exists) {
                return doc.data() as IDocumento<string, string, string, string, string>;//cambiar el tipo de dato
            } else {
                console.log("No se encontró el documento con el ID:", documentoId);
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el documento:", error);
            return null;
        }
    }
}
