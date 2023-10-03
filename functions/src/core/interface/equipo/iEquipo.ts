export interface IEquipo <CATEGORIAEQUIPO> {
    id: string;
    identificador: string;
    marca: string;
    tipo: string;
    isEliminado: boolean;
    modelo: string;
    isServicio: boolean;
    categoria: CATEGORIAEQUIPO;
    metadata: Map<any, any>; // QUE VALOR SE PONE EN METADATA
}