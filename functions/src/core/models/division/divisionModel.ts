import { IDivision } from "../../interface";
import {
     Documento,
     Equipo,
     Herramienta,
     Vehiculo,
         } from "../index";

//exportar usuario, documento usuario, plan usuario
export class Division implements IDivision<string,Documento,Equipo,Herramienta,Vehiculo,string,string> {
    id: string;
    codigo: string;
    createdAt: Date;
    updateAt: Date;
    displayName: string;
    nombre: string;
    faena: string;
    responsable: string; // definir tipo
    tipoDivison: string;
    documentos: Documento;
    usuarios: string; //definir tipo
    equipos: Equipo;
    herramienta: Herramienta;
    vehiculos: Vehiculo;
    documentosUsuarios: string;// definir tipo 
    configDocumentos: string; 
    planesDeSeguimiento: string; //definir tipo
}
