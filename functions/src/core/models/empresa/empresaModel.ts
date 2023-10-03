import { IEmpresa } from "../../interface";
import { ArchivoEmb } from "../archivoEmb";
import { ConfigEmb } from "../configEmb";
import { Correlativo } from "../correlativo";
import { Documento } from "../documento";
import { Equipo } from "../equipo";
import { Gerencia } from "../gerencia";
import { PlanDeSeguimiento } from "../planDeSeguimiento";
import { Vehiculo } from "../vehiculo";
export class Empresa implements IEmpresa <ArchivoEmb,ConfigEmb,Correlativo,Documento,Documento,Documento,Gerencia,object,Equipo,Vehiculo,PlanDeSeguimiento>{
    archivos: ArchivoEmb;
    config: ConfigEmb;
    correlativo: Correlativo;
    documentos: Documento;
    documentosRespaldo: Documento;
    documentosPorMes: Documento;
    gerencias: Gerencia;
    id: string;
    nombre: string;
    usuarios: object;
    vehiculos: Vehiculo;
    equipos: Equipo;
    planesDeSeguimiento: PlanDeSeguimiento;
    repositorio: string;
    usuarioRespuesta: string;
    utils: object;
}