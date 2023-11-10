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

    static saveFilePDF(empresa: string, pdf: any): Promise<Archivo|null> {
      return new Promise((resolve, reject) => {
        const archivo = new Archivo();
    
        try {
          this.id = uuidv4();
          this.filePath = `${empresa}/pdf/${this.id}`;
          this.token = uuidv4();
          const options = {
            metadata: {
              contentType: "application/pdf",
              metadata: {
                firebaseStorageDownloadTokens: this.token,
              },
            },
          };
    
          const bucket = admin.storage().bucket("vaku-dev.appspot.com");
          const file = bucket.file(this.filePath);
    
          // Asynchronously save the file
          file.save(pdf, options)
            .then(() => {
              const urlFile = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(this.filePath)}?alt=media&token=${this.token}`;
              const nombrePDF = `${empresa}_pdf_${this.id}.pdf`;
              console.log("la url es: ",urlFile)
              archivo.id = this.id;
              archivo.name = nombrePDF;
              archivo.path = this.filePath;
              archivo.url = urlFile;    
              resolve(archivo);
            })
            .catch((error) => {
              console.error(error);
              reject(null);
            });
        } catch (error) {
          console.error(error);
          reject(null);
        }
      });
    }
}