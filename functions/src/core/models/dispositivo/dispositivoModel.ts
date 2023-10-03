import { IDispositivo } from "../../interface/dispositivo";

export class Dispositivo implements IDispositivo  {
    id!: string;  
    os!: string;  
    token!: string;  
    createdAt!: Date;
  }
  