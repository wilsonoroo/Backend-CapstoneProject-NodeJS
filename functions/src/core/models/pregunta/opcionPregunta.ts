import { IOpcionPregunta } from "../../interface/pregunta";
import { Pregunta } from "./preguntaModel";


export class OpcionPregunta implements IOpcionPregunta<Pregunta>{

    id: string;
    label: string;
    valor: string;
    urlImagen: string;
    color:string;
    isMalo: boolean;
    enableUploadFoto: boolean;
    children?: Pregunta;
    enableComentario: boolean;

}