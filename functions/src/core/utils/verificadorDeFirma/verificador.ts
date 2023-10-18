import { Integrante, Documento } from "../../models";

export function todosHanFirmado(documento: Documento): boolean {
    // Verificar si el documento tiene una cuadrilla
    if (!documento.cuadrilla) {
        return false;
    }
    // Asegúrate de que estás accediendo al mapa 'integrantes' dentro de cuadrilla
    const integrantes = Object.values(documento.cuadrilla.integrantes);
    return integrantes.every((integrante: Integrante) => integrante.isFirmado === true);
}
