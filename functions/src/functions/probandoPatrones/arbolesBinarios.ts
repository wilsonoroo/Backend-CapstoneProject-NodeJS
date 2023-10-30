class Nodo{
    izquierda: Nodo|null;
    derecha: Nodo|null;
    valor: AbstractHandler;

    constructor(valor: AbstractHandler) {
        this.valor = valor;
    }
}
class ArbolBinario{
    root: Nodo|null;
    insertarNodo(lista: (AbstractHandler | null)[]) {
        let indice = 0; 

        const agregarRecursivo = (): Nodo | null => {
            if (indice >= lista.length) return null;

            const valorActual = lista[indice++];
            if (valorActual === null) return null;

            const nodo = new Nodo(valorActual);
            nodo.izquierda = agregarRecursivo();
            nodo.derecha = agregarRecursivo();

            return nodo;
        }

        this.root = agregarRecursivo();
    }
    procesarDocumento(documento: Documento): boolean {
        return this.recorrerArbol(this.root, documento);
    }
    
    private recorrerArbol(nodo: Nodo | null, documento: Documento): boolean {
        if (!nodo) return false;
    
        // Procesa el nodo actual
        const resultadoActual = nodo.valor.handle(documento);
    
        if (resultadoActual) {
            // Si el resultado es verdadero, procesamos el nodo izquierdo
            return this.recorrerArbol(nodo.izquierda, documento);
        } else {
            // Si el resultado es falso, procesamos el nodo derecho
            return this.recorrerArbol(nodo.derecha, documento);
        }
    }
}

import {onRequest} from 'firebase-functions/v2/https';
import {Request, Response} from 'firebase-functions';
import { AbstractHandler,HandlerCambioEstado,HandlerGenerarPDF,HandlerNeedValidacion,HandlerNotificacion,HandlerPlanAccion,HandlerProblemas } from './ChaingOfResponsability';
import { Documento } from '../../core/models';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { plainToClass } from 'class-transformer';
import { convertDocumentTimestampsToDate } from '../../core/utils';
import { procesarDocumento } from '../../core/caseUse/generarDoc';

export const arboltest =onRequest(async (request: Request, response: Response) => {
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerPlanAccion();
    const generarPDF = new HandlerGenerarPDF();
    const notificacion = new HandlerNotificacion();
    const cambioEstado = new HandlerCambioEstado();
    arbol.insertarNodo([validacion,generarPDF,notificacion,planAccion,cambioEstado,null,null,cambioEstado,null,null,null,null,problemas,cambioEstado,notificacion,null,null,null,cambioEstado,notificacion]);
    
    try {
        response.send('arbolito');
    } catch (error) {
        response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});

export const flujoHandler = onDocumentCreated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {
    const data = event.data?.data();
    console.log("data:", data);
    const transformedData = convertDocumentTimestampsToDate(data);
    const doc = plainToClass(Documento, transformedData);
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    const planAccion = new HandlerPlanAccion();
    const generarPDF = new HandlerGenerarPDF();
    const notificacion = new HandlerNotificacion();
    const cambioEstado = new HandlerCambioEstado();
    // arbol.insertarNodo([validacion,problemas]);
    arbol.insertarNodo([validacion,generarPDF,notificacion,planAccion,cambioEstado,null,null,cambioEstado,null,null,null,null,problemas,cambioEstado,notificacion,null,null,null,cambioEstado,notificacion]);
    arbol.procesarDocumento(doc);
})
export const handler = onDocumentCreated("empresas/{nombreEmpresa}/gerencias/{nombreGerencia}/divisiones/{nombreDivision}/documentos/{docId}", async(event)  => {
    const data = event.data?.data();
    const transformedData = convertDocumentTimestampsToDate(data);
    const doc = plainToClass(Documento, transformedData);
    console.log("--------caso de uso ----->");
    procesarDocumento(doc);
})
