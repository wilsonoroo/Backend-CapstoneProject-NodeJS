import { IEquipo } from "../../interface";
export class Equipo implements IEquipo<CategoriaEquipoEnum> {
    id: string;
    identificador: string;
    marca: string;
    tipo: string;
    isEliminado: boolean;
    modelo: string;
    isServicio: boolean;
    categoria: CategoriaEquipoEnum;
    metadata: any[];

}
enum CategoriaEquipoEnum {
    // Ejemplo:
    // CATEGORIA_A = "Categoria A",
    // CATEGORIA_B = "Categoria B",
    // ...
}
