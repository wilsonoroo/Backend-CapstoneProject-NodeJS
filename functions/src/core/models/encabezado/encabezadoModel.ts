import { IEncabezado } from "../../interface";
export class Encabezado implements IEncabezado{

    id: string;
    tipoVehiculo?: string;
    numeroInterno?: string;
    patente?: string;
    kilometraje?: string;
    fechaRevisionTecnica?: string;
    tipoInspeccion?: string;
    marca?: string;
    tipoTrabajo?: string;
    empresa?: string;
    area?: string;
    turnoTrabajo?: string;
    lugarFaena: string;

}