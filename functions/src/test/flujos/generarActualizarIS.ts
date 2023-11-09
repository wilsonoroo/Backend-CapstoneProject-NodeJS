import { ArbolBinario, HandlerCambioEstado, HandlerEstadoGenerado, HandlerIsTipoIS, HandlerTodosHanFirmado, HandlerTrue } from "../../core/caseUse/builder";


export function flujoIS(): ArbolBinario{

    const arbol = new ArbolBinario();
    const documentoESIS = new HandlerIsTipoIS();
    const firmaIntegrantes = new HandlerTodosHanFirmado();
    const estadoGenerado = new HandlerEstadoGenerado();
    const aux = new HandlerTrue();
    const cambioEstado = new HandlerCambioEstado("pendiente_validar");



    arbol.insertarNodo([documentoESIS, firmaIntegrantes, estadoGenerado, aux, cambioEstado, aux, aux, null, null, null, null, null, null, aux, aux]);
    return arbol;
}