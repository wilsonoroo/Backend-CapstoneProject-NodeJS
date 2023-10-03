import { IRespuesta } from "../../interface";

export class respuestaModel implements IRespuesta<any>{
    id: string;
    contenido: string;
    titulo: string;
    tipo: string;
    index: number;
    isRequired: boolean;
    seccionId: string;
    observacion: string;
    imagenes: any;
}
