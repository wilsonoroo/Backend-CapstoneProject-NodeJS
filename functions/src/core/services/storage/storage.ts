import { Archivo } from "../../models/archivo"
import admin from "firebase-admin";
const { uuidv4 } = require("uuid");
// import { uuidv4 } from "uuid";

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
    static saveFile(empresa:string,pdf:any): Archivo{
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

        const urlFile = "https://firebasestorage.googleapis.com/v0" + file.parent.baseUrl + "/" + file.metadata.bucket + file.baseUrl + "/" + empresa + "%2Fpdf%2F" + this.id + "?alt=media&token=" + this.token;

        let archivo = new Archivo();
        archivo.id= this.id;
        archivo.name="archivo1.pdf";
        archivo.path=this.filePath;
        archivo.url=urlFile;
        archivo.size=file.metadata.size;
    

        return archivo;    

    }
}