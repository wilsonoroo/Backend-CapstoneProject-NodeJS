export interface IRepository<T> {
	// Metodos para manejos de documentos o nodos
	// Metodos asociados a obtencion de datos
	getDocument<T>(documentId: string): Promise<T | null>
	getDocumentsByField<T>(...query: any[]): Promise<T[]>
	getAlldocuments(): Promise<T[]>

	// Metodos asociados la agregar datos
	addDocument<T>(document: T): Promise<void>
	addDocumentById(documentId: string, document: any): Promise<any>
	setReference(newReference: string):string;

	// Metodos asociados la update datos
	updateDocument(documentId: string, document: T): Promise<void>

	// Metodo para eliminar un documento
	deleteDocument(documentId: string): Promise<void>

	// metodos soaciados a CRUD de colecciones
	// deleteCollection<T>(collectionName: string): Promise<boolean>

}
