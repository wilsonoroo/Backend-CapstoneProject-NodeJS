import { generarDoc,} from "./functions/test";
import {initializeApp} from "firebase-admin/app";
import { flujoNuevoDocumentoConArboles, } from './functions/flujoDoc/flujoArbol';
import { FlujoactualizarDocumentoArboles } from "./functions/flujoActualizarPDF/flujoArbolActualizar";
import { flujoISArboles } from "./functions/flujoIS/t2";
initializeApp();
export const doc = generarDoc;//genera un documento en firestore de prueba 
export const flujoGenerarDocumento = flujoNuevoDocumentoConArboles; //flujo generar Doc de tipo LV optimizado con arboles binarios
export const flujoActualizacionDocumento = FlujoactualizarDocumentoArboles; //flujo actualizar Doc de tipo LV optimizado con arboles binarios
export const flujoIS = flujoISArboles; //flujo generar y actualizar Doc de tipo IS optimizado con arboles binarios