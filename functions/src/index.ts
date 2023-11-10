import {initializeApp} from "firebase-admin/app";
import { contadorDistribuidoParaUsuario, flujoISArboles,flujoNuevoDocumentoConArboles,FlujoactualizarDocumentoArboles,generarDoc } from "./functions";
initializeApp();
export const doc = generarDoc;//genera un documento en firestore de prueba 
export const flujoGenerarDocumento = flujoNuevoDocumentoConArboles; //flujo generar Doc de tipo LV optimizado con arboles binarios
export const flujoActualizacionDocumento = FlujoactualizarDocumentoArboles; //flujo actualizar Doc de tipo LV optimizado con arboles binarios
export const flujoIS = flujoISArboles; //flujo generar y actualizar Doc de tipo IS optimizado con arboles binarios
export const contadorDisrtribuidoUsuario = contadorDistribuidoParaUsuario;