

import { Cuadrilla, Integrante } from "../../core/models";

export function todosHanFirmado(cuadrilla: Cuadrilla): boolean {
    // Asegúrate de que estás accediendo al mapa 'integrantes' dentro de cuadrilla
    const integrantes = Object.values(cuadrilla.integrantes);
    return integrantes.every((integrante: Integrante) => integrante.isFirmado === true);
}

