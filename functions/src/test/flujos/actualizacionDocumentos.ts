import { ArbolBinario, HandlerCambioEstado, HandlerEstadoActual, HandlerEstadoAnterior, HandlerNeedPlanAccion, HandlerTienePlanAccion, HandlerTrue } from "../../core/caseUse/builder";

export function flujoActualizarDocumento(): ArbolBinario{
    const arbol = new ArbolBinario();
    const estadoActualValidado = new HandlerEstadoActual("validado","finalizado");
    const estadoActualRechazado = new HandlerEstadoActual("rechazado");
    const estadoAnteriorRechazado = new HandlerEstadoAnterior("rechazado");
    const estadoAnterior = new HandlerEstadoAnterior("doc_con_problemas","doc_sin_problemas");
    const tienePlanAccion = new HandlerTienePlanAccion();
    const needPlanAccion = new HandlerNeedPlanAccion();
    const estadoFinalizado= new HandlerCambioEstado("finalizado");
    const estadoFinalizadoPlanAccion= new HandlerCambioEstado("finalizado_sin_plan_accion");
    const estadoRechazado = new HandlerCambioEstado("rechazado");
    const estadoRechazadoPlanAccion = new HandlerCambioEstado("rechazado_sin_plan_accion");
    const aux = new HandlerTrue();

    arbol.insertarNodo([estadoActualValidado,estadoAnterior,aux,aux,
        tienePlanAccion,estadoFinalizado,aux,null,null,null,
        needPlanAccion,estadoFinalizadoPlanAccion,aux,null,null,null,
        estadoFinalizado,aux,null,null,null,null,null,
        estadoFinalizado,aux,null,null,null,estadoActualRechazado,estadoAnteriorRechazado,null,
        aux,tienePlanAccion,estadoRechazado,aux,aux,aux,null,null,null,null,null,
        needPlanAccion,estadoRechazadoPlanAccion,aux,null,null,null,estadoRechazado,aux,aux,aux]);
    return arbol;
}
