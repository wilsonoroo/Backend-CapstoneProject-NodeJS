import { IDocumentoUsuario } from "../../interface/documentoUsuario";
import { DisplayDoc } from "../displayDoc/displayDoc";


export class DocumentoUsuario implements IDocumentoUsuario <DisplayDoc>{

    enEsperaValidacion: DisplayDoc;
    enviadosHSEQ: DisplayDoc;
    porValidar: DisplayDoc;
    procesoFinalizado: DisplayDoc;
    procesoPendiente: DisplayDoc;
    rechazados: DisplayDoc;
    enEsperaDobleValidacion: DisplayDoc;
    countEnEsperaValidacion: number;
    countEnviadosHSEQ: number;
    countPorValidar: number;
    countProcesoFinalizado: number;
    countProcesoPendiente: number;
    countRechazados: number;
    countEnEsperaDobleValidacion: number;

}