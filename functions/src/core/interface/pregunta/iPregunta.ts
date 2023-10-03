


export interface IPregunta <TipoPregunta> {

    id: string;
    contenido: string;
    titulo: string;
    tipo: string;
    index: string;
    isRequired: boolean;
    seccionId: string;
    tipoPregunta:TipoPregunta;
    

}