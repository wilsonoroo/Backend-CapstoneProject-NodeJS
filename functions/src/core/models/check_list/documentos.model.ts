//import { Type } from 'class-transformer';
 import { User } from '../user';
//import { FakeUser } from '../user/fakeUser.model';


export class Documentos {

  id!: string | null;
  correlativo!: string;
  isPlanDeAccion!: boolean;
  emisor!: User;
  // // emisor = new FakeUSer();
  // getRut(): string {
  //   return this.emisor.rut;
  // }  
  // getCargo(): string {
  // return this.emisor.cargo;
  // }
  // getEmail(): string {
  // return this.emisor.email;
  // }
}



