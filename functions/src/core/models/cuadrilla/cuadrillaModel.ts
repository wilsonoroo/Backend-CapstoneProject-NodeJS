import { ICuadrilla } from "../../interface";
import { Integrante } from "../integrante";

export class Cuadrilla implements ICuadrilla<Integrante>{
    id: string;
    nombre: string;
    validadores: Integrante;
    integrantes: Integrante;
}
