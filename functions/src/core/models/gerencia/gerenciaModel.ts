import { IGerencia } from "../../interface";
import { Division } from "../division";

export class Gerencia implements IGerencia <Division> {
    divisiones: Division;
    id: string;
    nombre: string;
    isEliminado: boolean;
    ubicacion: string;
    updatedAt: Date;
    createAt: Date;
}