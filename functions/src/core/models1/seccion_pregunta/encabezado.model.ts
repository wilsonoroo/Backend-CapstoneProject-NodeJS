import {Vehiculo} from '../vehiculo/vehiculo';

import {ComplementoVehiculo} from './complemento_vehiculo.model';

export class Encabezado {
  numeroInterno!: string;
  lugarFaena!: string;
  patente!: string;
  vehiculo!: Vehiculo;
  tipoVehiculo!: string;
  inspeccion!: string;
  tipoIngreso!: string;
  fechaVencimientoRevisionTecnica!: Date;
  kilometraje!: string;
  descripcionDelTrabajo!: string;
  areaTrabajo!: string;
  empresaADesarrollar!: string;

  // transportes carga
  origen!: string;
  destino!: string;
  servicio!: string;
  ordenTrabajo!: string;
  guia!: string;
  gerencia!: string;
  complementoVehiculo!: ComplementoVehiculo;
}
