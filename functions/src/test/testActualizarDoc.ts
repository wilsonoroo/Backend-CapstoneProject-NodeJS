// import { FirestoreRepository } from "../src/core";
// import { DocumentoEstado } from "../src/core";
import { documentoAnteriorConProblemas, documentoAnteriorCualquiera, documentoNecesitaPlanDeAccion, documentoRechazadoConPlanAccion, documentoRechazadoYNecesitaPlanAccion, documentoRechazadoYNoNecesitaPlanAccion, documentoValidado, documentoValidadoConPlanAccion, documentoValidadoNoNecesitaPlanAccion } from "./documentos/index";
import { flujoActualizarDocumento } from "./flujos/actualizacionDocumentos";
const assert = require("assert");

describe(' 5) El Flujo actualizar documento debe actualizar el estado de un documento', function() {
    it('Debe procesar un documento y cambiar su estado de validado a finalizado', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoValidado();
        const docAnterior= documentoAnteriorCualquiera();
        
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "finalizado");
    });
});


describe(' 6) Debe procesar el Flujo de actualizar documento y cambiar su estado', function() {
    it('Pasar de doc_con_problemas a finalizado cuando tiene plan de accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoValidadoConPlanAccion();
        const docAnterior= documentoAnteriorConProblemas();
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "finalizado");
    });
});
describe(' 7) Debe procesar el Flujo de actualizar documento y cambiar su estado', function() {
    it('Pasar de doc_con_problemas a finalizado cuando no tiene plan de accion y no necesita plan de accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoValidadoNoNecesitaPlanAccion();
        const docAnterior= documentoAnteriorConProblemas();
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "finalizado");
    });
});
describe(' 8) Debe procesar el Flujo de actualizar documento y cambiar su estado', function() {
    it('Pasar de doc_con_problemas a finalizado cuando no tiene plan de accion y si necesita plan de accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoNecesitaPlanDeAccion();
        const docAnterior= documentoAnteriorConProblemas();
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "finalizado_sin_plan_accion");
    });
});
describe(' 9) Debe procesar el Flujo de actualizar documento y cambiar su estado', function() {
    it('Mantiene su estado rechazado cuando tiene plan de accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoRechazadoConPlanAccion();
        const docAnterior= documentoAnteriorConProblemas();
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "rechazado");
    });
});
describe(' 10) Debe procesar el Flujo de actualizar documento y cambiar su estado', function() {
    it('Mantiene su estado rechazado cuando no tiene plan de accion y no necesita plan de accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoRechazadoYNoNecesitaPlanAccion();
        const docAnterior= documentoAnteriorConProblemas();
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "rechazado");
    });
});
describe(' 11) Debe procesar el Flujo de actualizar documento y cambiar su estado', function() {
    it('Mantiene su estado rechazado cuando no tiene plan de accion y  necesita plan de accion', function() {
        // Crea el árbol de flujo
        const arbol = flujoActualizarDocumento();
        const doc =documentoRechazadoYNecesitaPlanAccion();
        const docAnterior= documentoAnteriorConProblemas();
        console.log("estado del documento en la prueba",doc.estado);
        console.log("estado del documento anterior en la prueba",docAnterior.estado);
        // Procesa el documento
        arbol.procesarDocumentoComplejo(doc,docAnterior);
        
        // Verifica que el estado haya cambiado
        assert.strictEqual(doc.estado, "rechazado_sin_plan_accion");
    });
});

