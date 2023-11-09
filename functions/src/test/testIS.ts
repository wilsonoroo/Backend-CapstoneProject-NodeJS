import { documentoIS } from "./documentos";
import { flujoIS } from "./flujos/generarActualizarIS";
const assert = require("assert");

describe(' 12) Debe actualizar el estado del documento IS', function() {
    it('Debe procesar el documento IS y cambiar su estado de generado a pendiente_validar', function() {
     
        const arbol = flujoIS();
        const doc = documentoIS();
        
        arbol.procesarDocumento(doc)

       
        assert.strictEqual(doc.estado, "pendiente_validar");

     
    });
});