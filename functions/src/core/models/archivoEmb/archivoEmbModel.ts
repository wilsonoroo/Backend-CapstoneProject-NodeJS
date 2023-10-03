import { IArchivoEmb } from "../../interface";
export class ArchivoEmb implements IArchivoEmb {
    id: string;
    createdAt: string;
    name: string;
    path: string;
    size: string;
    token: string;
    url: string;
}