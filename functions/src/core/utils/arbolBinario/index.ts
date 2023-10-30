import { Documento } from "../../models";
import { AbstractHandler } from "../chainOfResponsability";

export class Nodo{
    izquierda: Nodo|null;
    derecha: Nodo|null;
    valor: AbstractHandler;

    constructor(valor: AbstractHandler) {
        this.valor = valor;
    }
}
export class ArbolBinario{
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