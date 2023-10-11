import { Archivo } from "../../models/archivo"
import admin from "firebase-admin";
// const { v4: uuidv4 } = require("uuid");


// interface IStorage {
//     id: string;
//     token: string;
// }
export class Storage{
    private static id: string;
    private static token: string;
    private static filePath: string;
    //agregar atributos de id y de token 
    static saveFile(empresa:string,pdf:any): Archivo{
        this.id ="token";
        this.filePath = empresa + "/pdf/" + this.id;
        this.token  = "token";
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