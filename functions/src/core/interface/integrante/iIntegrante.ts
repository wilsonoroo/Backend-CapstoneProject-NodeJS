export interface IIntegrante{
    id: string;
    rut: string;
    cargo: string;
    nombre: string;
    codigo: string;
    isFirmado: boolean;
    fechaFirmado: Date;
    // usuario: AUTH;
}