import { IPermisos } from "../../interface/permiso";

export class PermisosModel implements IPermisos <string> {
    
    id?: string;
    codigo?: string;
    displayName?: string;
    subTitulo?: string;
    // permisos!: PermisosModel;
       
}