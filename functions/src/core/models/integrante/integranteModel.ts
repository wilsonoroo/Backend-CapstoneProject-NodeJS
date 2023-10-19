import { IIntegrante } from "../../interface";
import { User } from "../usuario";

export class Integrante extends User implements IIntegrante{
    id: string;
    rut: string;
    cargo: string;
    nombre: string;
    codigo: string;
    isFirmado: boolean;
    fechaFirmado!: Date;
}