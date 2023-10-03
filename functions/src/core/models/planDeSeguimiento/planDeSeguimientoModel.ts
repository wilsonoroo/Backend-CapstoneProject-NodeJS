import { IPlanDeSeguimiento } from "../../interface";

export class PlanDeSeguimiento implements IPlanDeSeguimiento <string,string,string>{
    id: string;
    estado: string;
    responsable: string;
    fechaCierre?: Date;
    fechaCompromiso: string;
    accionCorrectiva?: string;
    accionSugerida?: string;
    fechaCreacion: Date;
    autor: string;
    evidencias: string;
    documento: string;

}