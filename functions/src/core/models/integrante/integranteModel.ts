import { IIntegrante } from "../../interface";
import { User } from "../usuario";

export class Integrante implements IIntegrante<User>{
    id: string;
    rut: string;
    cargo: string;
    nombre: string;
    codigo: string;
    isFirmado: boolean;
    usuario: User;
}