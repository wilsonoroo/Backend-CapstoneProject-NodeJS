import { ICuadrilla } from "../../interface";
export class Cuadrilla implements ICuadrilla<string>{
    id: string;
    nombre: string;
    validadores: string;
    integrantes: string;
}
