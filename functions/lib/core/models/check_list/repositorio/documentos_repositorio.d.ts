import { IRepositorio } from '../../repositorio/base_repositorio';
import { Documento } from '../documento.model';
export declare class RepositorioDocumentos implements IRepositorio<Documento> {
    empresaRef: string;
    getAll(): Promise<import("@firebase/database-types").DataSnapshot>;
    getById(key: string): Promise<import("@firebase/database-types").DataSnapshot>;
    create(documento: Documento): import("@firebase/database-types").ThenableReference;
    update(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
}
//# sourceMappingURL=documentos_repositorio.d.ts.map