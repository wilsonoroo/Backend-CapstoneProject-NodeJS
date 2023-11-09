import { ArbolBinario, HandlerCambioEstado, HandlerNeedPlanAccion, HandlerNeedValidacion, HandlerProblemas, HandlerTrue } from "../../core/caseUse/builder";

export function flujoGenerarDocumento(): ArbolBinario{
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const estadoConProblemas = new HandlerCambioEstado("doc_con_problemas");


    const aux = new HandlerTrue();

    const planAccion = new HandlerNeedPlanAccion();
    const estadoSinProblemas = new HandlerCambioEstado("doc_sin_problemas");
    const estadoFinalizado = new HandlerCambioEstado("finalizado");
    const estadoFinalizadoPlan = new HandlerCambioEstado("finalizado_sin_plan_accion");
    const estadoValidado = new HandlerCambioEstado("validado");
    arbol.insertarNodo([validacion,problemas,estadoConProblemas,aux,aux,null,null,null,null,estadoSinProblemas,aux,aux,null,null,null,null,aux,aux,estadoValidado,planAccion,estadoFinalizadoPlan,aux,null,null,null,estadoFinalizado,aux]);
    return arbol;
}