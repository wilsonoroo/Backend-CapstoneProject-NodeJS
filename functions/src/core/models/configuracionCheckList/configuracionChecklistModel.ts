import { IConfiguracionCheckList } from "../../interface/configuracionCheckList";

export class ConfiguracionChecklist implements IConfiguracionCheckList {
    needValidacion!: boolean;
    needPlanDeAccion!: boolean;
    validacionGlobal!: boolean;
    cantidadMaximaFotos!: number;
    autoValidacionIS!: boolean;
  }