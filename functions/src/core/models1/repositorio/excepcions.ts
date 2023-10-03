export class ErrorUpdate {
  mensaje: string;
  error: string;
  constructor(error: string, mensaje: string) {
    this.mensaje = mensaje;
    this.error = error;
  }
}
