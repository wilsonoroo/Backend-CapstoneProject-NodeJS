import {Type} from 'class-transformer'

import {Documento} from '../check_list/documento.model'
export class BibliotecaDocumentos {
	@Type(() => Documento)
	documento: Documento
	addDoc(documentoFinalizado: Documento) {
		this.documento = documentoFinalizado
		throw new Error('Method not implemented.')
	}
}
