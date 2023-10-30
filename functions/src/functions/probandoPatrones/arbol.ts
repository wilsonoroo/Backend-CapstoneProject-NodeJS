class Nodo{
    izquierda: Nodo|null;
    derecha: Nodo|null;
    valor: string;

    constructor(valor: string) {
        this.valor = valor;
    }
}
class ArbolBinario{
    root: Nodo|null;
    insertarNodo(lista: (string | null)[]) {
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
    printByLevels2() {
        if (!this.root) return;

        const queue: (Nodo | null)[] = [this.root, null];  // Usamos Nodo | null para la cola
        let level = 1;

        console.log(`nivel ${level}`);

        while (queue.length > 1) {
            const currentNode = queue.shift();
            if (currentNode) {
                console.log(currentNode.valor);
                if (currentNode.izquierda) queue.push(currentNode.izquierda);
                if (currentNode.derecha) queue.push(currentNode.derecha);
            } else {
                level++;
                console.log(`\nnivel ${level}`);
                queue.push(null);  // Agregar marcador 'null' para el próximo nivel
            }
        }
    }
    imprimirArbol() {
        this.imprimirRecursivo(this.root, 1, "Raíz");
    }

    private imprimirRecursivo(nodo: Nodo | null, nivel: number, padre: string) {
        if (!nodo) return;

        console.log(`Nivel: ${nivel}`);
        console.log(`Nodo: ${padre}`);
        console.log(`Izquierdo: ${nodo.izquierda ? nodo.izquierda.valor : 'N/A'}`);
        console.log(`Derecho: ${nodo.derecha ? nodo.derecha.valor : 'N/A'}`);
        console.log('------------------');

        this.imprimirRecursivo(nodo.izquierda, nivel + 1, nodo.valor);
        this.imprimirRecursivo(nodo.derecha, nivel + 1, nodo.valor);
    }
    test() {
        if (!this.root) return;
        console.log("----Ahora la izquierda----")
        this.imprimirRootDER(this.root);
        console.log("----Ahora la derecha----")
        this.imprimirRootDER(this.root);

    }    
    imprimirRootDER(nodo: Nodo) {
        if (!nodo) return;
        console.log(nodo);

        if (nodo.derecha){
            nodo = nodo.derecha
            this.imprimirRootDER(nodo);
        }
    }
    imprimirRootIZQ(nodo: Nodo) {
        if (!nodo) return;
        console.log(nodo);

        if (nodo.izquierda){
            nodo = nodo.izquierda
            this.imprimirRootIZQ(nodo);
        }
    }

}

import {onRequest} from 'firebase-functions/v2/https';
import {Request, Response} from 'firebase-functions';

export const arboltest =onRequest(async (request: Request, response: Response) => {
    const arbol = new ArbolBinario();
    await arbol.insertarNodo(['validacion','GenerarPDF','notificacion','planDeAccion','cambioEstado',null,null,'cambioestado',null,null,null,null,'tieneProblemas','cambiarEstado','notificacion',null,null,null,'cambiarEstado','notificacion']);
    // await arbol.insertarNodo(['validacion','GenerarPDF','notificacion']);
    // await arbol.imprimirArbol();
    // await arbol.imprimirRoot();
    await arbol.test();
    try {
        response.send('arbolito impreso rot test DER');
    } catch (error) {
        response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});