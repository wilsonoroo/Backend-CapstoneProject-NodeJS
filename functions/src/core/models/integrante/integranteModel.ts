import { IIntegrante } from "../../interface";

export class Integrante implements IIntegrante<string>{
    id: string;
    rut: string;
    cargo: string;
    nombre: string;
    codigo: string;
    isFirmado: boolean;
    usuario: string;
}