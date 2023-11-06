export enum DocumentoEstado {
    validado = "validado",
    sinProblemas = "doc_sin_problemas",
    conProblemas = "doc_con_problemas",
    finalizado = "finalizado",
    finalizadoPlan = "finalizado_sin_plan_accion",
    rechazado = "rechazado",
    rechazadoPlan = "rechazado_sin_plan_accion",
    generado = "generado",
    pendienteValidar = "pendiente_validar",
    // ... otros estados que necesites
}