export interface IIntegrante<AUTH>{
    id: string;
    rut: string;
    cargo: string;
    nombre: string;
    codigo: string;
    isFirmado: boolean;
    usuario: AUTH;
}