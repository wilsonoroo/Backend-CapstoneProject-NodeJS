import { IHerramienta } from "../../interface";

export class Herramienta implements IHerramienta<CategoriaHerramientaEnum> {
    id: string;
    identificador: string;
    marca: string;
    tipo: string;
    isEliminado: boolean;
    modelo: string;
    isServicio: boolean;
    categoria: CategoriaHerramientaEnum;
    metadata: any[]; // que se pone en metadata
}
enum CategoriaHerramientaEnum {
    // CUALES SON LAS CATEGORIAS DE HERRAMIENTAS QUE PUEDE HACER, EJMPLO:
    // CategoriaA = "Categoria A",
    // CategoriaB = "Categoria B",
}