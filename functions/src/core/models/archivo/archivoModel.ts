import { IArchivo } from "../../interface";

export class Archivo implements IArchivo {
    id: string;
    name?: string;
    path?: string;
    url?: string;
    size?: number;
    createdAt?: Date;
}