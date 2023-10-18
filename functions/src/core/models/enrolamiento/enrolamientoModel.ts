import { IEnrolamiento } from "../../interface/enrolamiento";

export class Enrolamiento implements IEnrolamiento <string> {
    isCompletado!: boolean;
    isTerminosCondiciones!: boolean;
    // fotografiaCarnet!: ArchivoModel;
    versionTerminosCondiciones!: string;
    // TODO: Verificar la fecha en la app movil este campo ya que se recibe un string
    fechaEnrolamiento!: Date;
}