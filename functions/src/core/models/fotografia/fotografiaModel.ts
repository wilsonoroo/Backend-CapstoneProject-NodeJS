import { IFotografia } from "../../interface/fotografia";

export class Fotografia implements IFotografia{
    id!: string;
    mimeType!: string;
    name!: string;
    path!: string;
    token!: string;
    url!: string;
}