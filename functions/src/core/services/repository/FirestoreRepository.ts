import {getFirestore} from 'firebase-admin/firestore'

/* The FirestoreRepository class is an implementation of the IFirestoreRepository interface. */
export class FirestoreRepository<T> implements IRepository<any> {
	db = getFirestore()
	reference: string

	constructor(reference: string) {
		this.reference = reference
	}
	getAlldocuments(): Promise<T[]> {
		return new Promise((resolve, reject) => {
			this.db
				.collection(this.reference)
				.get()
				.then((querySnapshot) => {
					try {
						const documents: T[] = []
						querySnapshot.forEach((doc) => {
							documents.push(doc.data() as T)
						})
						resolve(documents)
					} catch (error) {
						console.error('Error al obtener los documentos:', error)
						reject(error)
					}
				})
				.catch((error) => {
					console.error('Error al obtener los documentos:', error)
					reject(error)
				})
		})
	}

	getDocument<T>(documentId: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.db
				.collection(this.reference)
				.doc(documentId)
				.get()
				.then((doc) => {
					if (doc.exists) {
						resolve(doc.data() as T)
					} else {
						console.log('No se encontró el documento con el ID:', documentId)
						reject('Not found')
					}
				})
				.catch((error) => {
					console.error('Error al obtener el documento:', error)
					reject(error)
				})
		})
	}
	getDocumentsByField<T>(...query: any[]): Promise<T[]> {
		throw new Error('Method not implemented.')
	}

	/**
	 *
	 * @param document
	 * @returns
	 */
	addDocument<T>(document: T): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db
				.collection(this.reference)
				.add(document as any)
				.then(() => {
					resolve()
				})
				.catch((error) => {
					reject(error)
				})
		})
	}
	addDocumentById(documentId: string, document: T): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db
				.collection(this.reference)
				.doc(documentId)
				.set(document as any)
				.then(() => {
					resolve('zxcz')
				})
				.catch((error) => {
					reject(error)
				})
		})
	}
	updateDocument<T>(documentId: string, document: T): Promise<void> {
		throw new Error('Method not implemented.')
	}
	updateDocumentParcial<T>(documentId: string, documentPartial: any): Promise<void> {
		throw new Error('Method not implemented.')
	}
	deleteDocument(documentId: string): Promise<void> {
		throw new Error('Method not implemented.')
	}

	deleteCollection(collectionName: string): Promise<boolean> {
		throw new Error('Method not implemented.')
	}
	addToCollection(collectionName: string, document: any): Promise<void> {
		throw new Error('Method not implemented.')
	}
}