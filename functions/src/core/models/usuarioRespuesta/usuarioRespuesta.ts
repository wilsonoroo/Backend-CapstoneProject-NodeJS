export class UsuarioRespuesta {
  id!: string | null;

  addDoc(usuarioRespuesta: UsuarioRespuesta) {
    this.id = usuarioRespuesta.id;
  }

  upDate() {
    throw new Error('Method not implemented.');
  }

  sendNotificacionISGenerada() {
    throw new Error('Method not implemented.');
  }

  constructor(id: string) {
    this.id = id;
  }
}
