import { ICuadrilla } from "../../interface";
export class cuadrilla implements ICuadrilla<string>{
    id: string;
    nombre: string;
    validadores: string;
    integrantes: string;
}