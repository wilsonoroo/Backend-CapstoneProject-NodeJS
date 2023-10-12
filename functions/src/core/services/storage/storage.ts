import { Archivo } from "../../models/archivo"
import admin from "firebase-admin";
const { v4: uuidv4 } = require("uuid");

export class Storage{
    private static id: string;
    private static token: string;
    private static filePath: string;
    /**
     *
     *
     * @static
     * @param {string} empresa
     * @param {*} pdf
     * @return {*}  {Archivo}
     * @memberof Storage
     * Metodo para  guardar un archivo PDF en el almacenamiento en el Storage 
     * y devolver un objeto Archivo para almacenarlo en la base de datos.
     */   
    static saveFilePDF(empresa:string,pdf:any): Archivo|null{

      try{
        let archivo = new Archivo();
        this.id =uuidv4();
        this.filePath = empresa + "/pdf/" + this.id;
        this.token  = uuidv4();
        const options = {
            metadata: {
              contentType: "application/pdf",
              metadata: {
                firebaseStorageDownloadTokens: this.token,
              },
            },
          };   

        
        const bucket = admin.storage().bucket();
        const file = bucket.file(this.filePath);
        file.save(pdf,options);

        const urlFile = "https://firebasestorage.googleapis.com/v0" + file.parent.baseUrl + "/" + bucket.name + file.baseUrl + "/" + empresa + "%2Fpdf%2F" + this.id + "?alt=media&token=" + this.token;
        const nombrePDF = empresa+"_pdf_"+this.id+".pdf";
        archivo.id= this.id;
        archivo.name=nombrePDF;
        archivo.path=this.filePath;
        archivo.url=urlFile;
        archivo.size=file.metadata.size;
        return archivo;   
      }catch(error){
        console.error(error);
        return null
      }

  

    }
}