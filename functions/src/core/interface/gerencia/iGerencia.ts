export interface IGerencia <DIVISION>{
    divisiones: DIVISION;  // Un arreglo de divisiones.
    id: string;
    nombre: string;
    isEliminado: boolean;
    ubicacion: string;
    updatedAt: Date;
    createAt: Date;
}