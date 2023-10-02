export interface IRepositorio<T> {
    getAll(): Promise<any>;
    getById(key: string): Promise<any>;
    create(obj: T): void;
    update(key: string, value: any): void;
    delete(key: string): void;
    deleteAll(): void;
}
//# sourceMappingURL=base_repositorio.d.ts.map