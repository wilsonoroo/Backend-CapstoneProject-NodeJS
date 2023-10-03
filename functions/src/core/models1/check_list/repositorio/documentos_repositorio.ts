import {db} from '../../../services';
import {IRepositorio} from '../../repositorio/base_repositorio';
import {Documento} from '../documento.model';

const ref = db.ref('/empresas');
const collection = '/documentos';

export class RepositorioDocumentos implements IRepositorio<Documento> {
  empresaRef!: string;

  getAll() {
    console.log(`empresas/${this.empresaRef}${collection}`);
    return ref.child(this.empresaRef).child(collection).get();
  }
  getById(key: string) {
    return ref.child(this.empresaRef).child(collection).child(key).get();
  }

  create(documento: Documento) {
    return ref.child(this.empresaRef).child(collection).push(documento);
  }

  update(key: string, value: any) {
    return ref
        .child(this.empresaRef)
        .child(collection)
        .child(key)
        .update(value);
  }

  delete(key: string) {
    return ref.child(this.empresaRef).child(collection).child(key).remove();
  }

  deleteAll() {
    return ref.remove();
  }
}
