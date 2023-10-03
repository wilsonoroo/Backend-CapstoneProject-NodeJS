import { IPregunta } from "../../interface/pregunta";
import { TipoPregunta } from "./tipoPregunta";


export class Pregunta implements IPregunta <TipoPregunta>{

    id: string;
    contenido: string;
    titulo: string;
    tipo: string;
    index: string;
    isRequired: boolean;        
    seccionId: string;
    tipoPregunta: TipoPregunta;


}