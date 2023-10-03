import { DocumentReference } from "firebase-admin/firestore";
import { IDisplayDoc } from "../../interface/displayDoc";
import { User } from "../usuario";
import { Checklist } from "../checklist";


export class DisplayDoc implements IDisplayDoc <User, Checklist, DocumentReference>{

    id: number;
    // encabezado: Encabezado;
    emisor: User;
    fechaCreacion: Date;
    fechaSubida: Date;
    fechaValidacion: Date;
    estado: string;
    isPlanDeAccion: boolean;
    supervisor?: User;
    validadoPor?: User;
    checkList: Checklist;
    // pdf?: Archivo;
    // cuadrilla: Cuadrilla;
    // vistos?: Visto;
    dobleValidadoPor: User;
    documentoRef: DocumentReference;

}