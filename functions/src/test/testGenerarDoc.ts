
import {  documentoConProblemas, documentoFinalizadSinPlanAccion, documentoFinalizado, documentoSinProblemas } from "./documentos/index";
import { flujoGenerarDocumento } from "./flujos/generarDocumentos";
const assert = require("assert");

describe(' 1) El Flujo generar documento debe actualizar el estado de un documento', function() {
    it('debe procesar un documento y cambiar su estado de generado a doc_con_problemas', function() {
        // Crea el árbol de flujo
        const arbol = flujoGenerarDocumento();
        const doc =documentoConProblemas();
        
        // Procesa el documento
        arbol.procesarDocumento(doc);
        console.log("estado del documento en la prueba",doc.estado);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "doc_con_problemas");
    });
});
describe(' 2) El Flujo generar documento debe actualizar el estado de un documento', function() {
    it('debe procesar un documento y cambiar su estado de generado a doc_sin_problemas', function() {
        // Crea el árbol de flujo
        const arbol = flujoGenerarDocumento();
        const doc =documentoSinProblemas();
        
        // Procesa el documento
        arbol.procesarDocumento(doc);
        console.log("estado del documento en la prueba",doc.estado);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "doc_sin_problemas");
    });
});
describe(' 3) El Flujo generar documento debe actualizar el estado de un documento', function() {
    it('debe procesar un documento y cambiar su estado de generado a finalizado', function() {
        // Crea el árbol de flujo
        const arbol = flujoGenerarDocumento();
        const doc =documentoFinalizado();
        
        // Procesa el documento
        arbol.procesarDocumento(doc);
        console.log("estado del documento en la prueba",doc.estado);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "finalizado");
    });
});
describe(' 4) El Flujo generar documento debe actualizar el estado de un documento', function() {
    it('debe procesar un documento y cambiar su estado de generado a finalizado_sin_plan_accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoGenerarDocumento();
        const doc =documentoFinalizadSinPlanAccion();
        
        // Procesa el documento
        arbol.procesarDocumento(doc);
        console.log("estado del documento en la prueba",doc.estado);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "finalizado_sin_plan_accion");
    });
});

