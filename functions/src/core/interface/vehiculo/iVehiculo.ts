export interface IVehiculo {
    id: string;
    numeroInterno: string;
    kilometraje: number;
    marca: string;
    modelo: string;
    tipoVehiculo: string;
    categoria: string;
    patente: string;
    proximaMantencion: Date;
    ultimaMantencion: Date;
    isEliminado: boolean;
    isServicio: boolean;
    metadata: any[]; // que va en metadata
    vencimientoRevisionTecnica: Date;
}