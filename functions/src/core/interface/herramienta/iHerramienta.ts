export interface IHerramienta<ENUMCATEGORIA> {
    id: string;
    identificador: string;
    marca: string;
    tipo: string;
    isEliminado: boolean;
    modelo: string;
    isServicio: boolean;
    categoria: ENUMCATEGORIA;
    metadata: Map<any, any>; // que se pone en metadata
}