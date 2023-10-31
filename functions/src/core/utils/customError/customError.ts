// CustomError.ts

export class CustomError {
    private nombre: string;
    private descripcion: string;

    constructor(nombre: string, descripcion: string) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    getNombre(): string {
        return this.nombre;
    }

    getDescripcion(): string {
        return this.descripcion;
    }


    toString(): string {
        return `${this.nombre}: ${this.descripcion}`;
    }
}
