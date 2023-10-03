export interface IRespuesta <ARCHIVO> {
    id: string;
    contenido: string;
    titulo: string;
    tipo: string;
    index: number;
    isRequired: boolean;
    seccionId: string;
    observacion: string;
    imagenes: ARCHIVO;
}