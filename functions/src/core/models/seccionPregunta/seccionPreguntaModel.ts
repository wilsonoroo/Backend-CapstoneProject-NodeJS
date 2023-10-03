import { ISeccionPregunta } from "../../interface/seccionPregunta"
import { Pregunta } from "../pregunta";




export class SeccionPregunta implements ISeccionPregunta<Pregunta>{
    id: string;
    nombre!: string;
    padre!: string;
    index!: number;
    instruccion!: string;
    isPaginate!: boolean;
    preguntas!: Pregunta;
    titulo!: string;
    // imagenReferencia!: ImagenReferenciaModel;
   
  }
  