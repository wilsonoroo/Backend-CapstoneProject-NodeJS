import { Documento } from "../../models"
import { Archivo } from "../../models/archivo"
export class EnkiCreator{
    static generarPDF(doc:Documento): Archivo{
        //subir pdf y retornalo 
        
        // de aqui abajo va al save file
        const archivo1 = new Archivo();
        archivo1.id="a1";
        archivo1.name="archivo1.pdf";
        archivo1.path="path1";
        archivo1.url="url1";
        archivo1.size=100;
        return archivo1;
		//throw new Error('Method not implemented.')
    }

}