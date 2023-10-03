import { ITipoPregunta } from "../../interface/pregunta";
import { OpcionPregunta } from "./opcionPregunta";


export class TipoPregunta implements ITipoPregunta<OpcionPregunta>{

    type: string;
    opciones: OpcionPregunta;

}