
export interface IOpcionPregunta<Pregunta> {


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