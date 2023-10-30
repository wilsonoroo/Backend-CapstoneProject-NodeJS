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
    

}

import {onRequest} from 'firebase-functions/v2/https';
import {Request, Response} from 'firebase-functions';

export const arboltest =onRequest(async (request: Request, response: Response) => {
    const arbol = new ArbolBinario();
    await arbol.insertarNodo(['validacion','GenerarPDF','notificacion','planDeAccion','cambioEstado','cambioestado','tieneProblemas','cambiarEstado','notificacion','cambiarEstado','notificacion']);
    await arbol.printByLevels2();
    try {
        response.send('arbolito');
    } catch (error) {
        response.status(500).send('Hubo un error al agregar el documento o las respuestas malas');
    }
});