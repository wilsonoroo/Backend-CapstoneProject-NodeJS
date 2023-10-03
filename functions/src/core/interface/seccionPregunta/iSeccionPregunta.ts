
export interface ISeccionPregunta <Pregunta>{

    id: string;
    nombre: string;
    padre: string;
    index: number;
    instruccion: string;
    isPaginate: boolean;
    titulo: string;
    preguntas: Pregunta;
    // imagenReferencia: ImagenReferenciaModel;

}