import { IConfigEmb } from "../../interface";

export class ConfigEmb implements IConfigEmb {
    id: string;
    isActive: boolean;
    logo: string;
    nombre: string;
    repositorioversion: string;
    documentos: string[];
}