import { IEnrolamiento } from "../../interface/enrolamiento";

export class Enrolamiento implements IEnrolamiento <string> {
    isCompletado!: boolean;
    isTerminosCondiciones!: boolean;
    // fotografiaCarnet!: ArchivoModel;
    versionTerminosCondiciones!: string;
    fechaEnrolamiento!: Date;
}