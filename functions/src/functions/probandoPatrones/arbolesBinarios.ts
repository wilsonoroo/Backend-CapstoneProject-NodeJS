class Nodo{
    izquierda: Nodo|null;
    derecha: Nodo|null;
    valor: Handler;

    constructor(valor: Handler) {
        this.valor = valor;
    }
}
class ArbolBinario{
    root: Nodo|null;
    insertarNodo(lista: (Handler | null)[]) {
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
    

}

import {onRequest} from 'firebase-functions/v2/https';
import {Request, Response} from 'firebase-functions';
import { Handler,HandlerNeedValidacion,HandlerProblemas } from '.';

export const arboltest =onRequest(async (request: Request, response: Response) => {
    const arbol = new ArbolBinario();
    const problemas = new HandlerProblemas();
    const validacion = new HandlerNeedValidacion();
    arbol.insertarNodo([validacion,problemas]);
  
    try {
        response.send('arbolito');
    } catch (error) {
        response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});