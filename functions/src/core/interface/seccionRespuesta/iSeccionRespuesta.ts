export interface ISeccionRespuesta<RESPUESTA,IMG>{
    id: string;
    nombre: string;
    index: number;
    padre?: string;
    instruccion: string;
    isPaginate: boolean;
    cantidad: number;
    respuestas: RESPUESTA;
    imagenReferencia: IMG;
}
