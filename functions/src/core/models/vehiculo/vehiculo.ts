export class Vehiculo {
  updateKilometraje(kilometraje: string) {
    this.kilometraje = kilometraje;
  }
  fechaVencimiento?: Date;
  id?: string;
  isEliminado?: boolean;
  isServicio?: boolean;
  kilometraje?: string;
  marca?: string;
  modelo?: string;
  numeroInterno?: string;
  patente?: string;
  tipo?: string;
  tipoVehiculo?: string;
  ultimaMantencion?: Date;
}
