// import { FirestoreRepository } from "../src/core";
// import { DocumentoEstado } from "../src/core";
import { ArbolBinario, HandlerCambioEstado, HandlerNeedPlanAccion, HandlerNeedValidacion, HandlerProblemas, HandlerTrue,  } from "../core/caseUse/builder";
import { documentoConProblemas } from "../functions/test2";
const assert = require("assert");
// import {initializeApp} from "firebase-admin/app";

// initializeApp();

describe('El Flujo debe actualizar el estado de un documento', function() {
    it('debe procesar un documento y cambiar su estado de generado a doc_con_problemas', function() {
        // Crea una instancia de FirestoreRepository y Documento
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

        // arbol.insertarNodo([validacion,problemas,estadoConProblemas,validacion]);
        const doc =documentoConProblemas();
        
        // Procesa el documento
        arbol.procesarDocumento(doc);
        console.log("estado del documento en la prueba",doc.estado);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "doc_con_problemas");
        // Agrega más aserciones para verificar el estado final deseado
        // assert.strictEqual(doc.estado, 'doc_con_problemas');
    });
});


describe('El Flujo IS', function() {
    it('LUCIANO GAY', function() {
        




    });
});