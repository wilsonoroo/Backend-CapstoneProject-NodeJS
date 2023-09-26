import { Documento } from './documento.model';

export class InstructivoSeguridad extends Documento {
  empresa: string;
  constructor(documento: Documento) {
    super();
    this.emisor = documento.emisor;
  }
}
