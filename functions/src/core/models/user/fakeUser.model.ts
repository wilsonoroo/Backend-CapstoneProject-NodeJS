export class FakeUser {
    rut!: string;
    correo!: string;
    edad!: string; 

    getRut(): string {
        return this.rut;
    }
}