import { Checklist, ConfiguracionChecklist, Cuadrilla, Documento, Integrante, Respuesta } from "../../core/models";

export function documentoConProblemas(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'generado';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
	configuracion.cantidadMaximaFotos = 10;
	checklist.configuracion = configuracion;	
	doc.checklist = checklist;
	const respuesta1 = new Respuesta();
	respuesta1.id = 'r1';
	respuesta1.contenido = 'contenido1';
	respuesta1.titulo = 'titulo1';
	respuesta1.tipo = 'tipo1';
	const respuesta2 = new Respuesta();
	respuesta2.id = 'r2';
	respuesta2.contenido = 'contenido2';
	respuesta2.titulo = 'titulo2';
	respuesta2.tipo = 'tipo2';
	const respuesta3 = new Respuesta();
	respuesta3.id = 'r3';
	respuesta3.contenido = 'contenido3';
	respuesta3.titulo = 'titulo3';
	respuesta3.tipo = 'tipo3';
	const respuestaC1 = new Respuesta();
	respuestaC1.id = 'rChiquita1';
	respuestaC1.contenido = 'contenidoChito1';
	respuestaC1.titulo = 'tituloChiquito1';
	respuestaC1.tipo = 'tipoChiquito1';
	const respuestaC2 = new Respuesta();
	respuestaC2.id = 'rChiquita2';
	respuestaC2.contenido = 'contenidoChito2';
	respuestaC2.titulo = 'tituloChiquito2';
	respuestaC2.tipo = 'tipoChiquito2';
	doc.respuestasMalas.push(respuesta1,respuesta2,respuesta3);
	doc.respuestasMalasChildren.push(respuestaC1,respuestaC2);
	return doc
}
export function documentoSinProblemas(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'generado';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
	configuracion.cantidadMaximaFotos = 10;
	checklist.configuracion = configuracion;	
	doc.checklist = checklist;
	return doc
}
export function documentoFinalizado(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'generado';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = false;
	configuracion.needPlanDeAccion = false;
	configuracion.validacionGlobal = true;
	configuracion.cantidadMaximaFotos = 10;
	checklist.configuracion = configuracion;	
	doc.checklist = checklist;
	return doc
}
export function documentoFinalizadSinPlanAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'generado';
	doc.respuestasMalas = [];
	doc.respuestasMalasChildren = [];
	const checklist = new Checklist();
	checklist.id = 'idChecklist';
	checklist.nombre = 'nombreChecklist';
	checklist.descripcion = 'descripcionChecklist';
	checklist.faena = 'faenaChecklist';
	const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = false;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
	configuracion.cantidadMaximaFotos = 10;
	checklist.configuracion = configuracion;	
	doc.checklist = checklist;
	return doc
}
export function documentoValidado(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = true;
	doc.emisor = user;
	doc.estado = 'validado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoValidadoConPlanAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = true;
	doc.emisor = user;
	doc.estado = 'validado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoValidadoNoNecesitaPlanAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'validado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needPlanDeAccion = false;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoNecesitaPlanDeAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'validado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needPlanDeAccion = true;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoAnteriorCualquiera(): Documento {
	
	const doc = new Documento();
	doc.id = 'd1';
	doc.isConCuadrilla= true;
	doc.isAutoValidado = true;
	doc.isPlanDeAccion = false;
	doc.estado = 'cualquiera';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = true;
	configuracion.needPlanDeAccion = true;
	configuracion.validacionGlobal = true;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoAnteriorConProblemas(): Documento {
	
	const doc = new Documento();
	doc.id = 'd1';
	doc.isPlanDeAccion = false;
	doc.estado = 'doc_con_problemas';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needValidacion = false;
	configuracion.needPlanDeAccion = false;
	configuracion.validacionGlobal = false;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoRechazadoConPlanAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isPlanDeAccion = true;
	doc.emisor = user;
	doc.estado = 'rechazado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needPlanDeAccion = true;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoRechazadoYNoNecesitaPlanAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'rechazado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needPlanDeAccion = false;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}
export function documentoRechazadoYNecesitaPlanAccion(): Documento {
	const user = new Integrante();
	user.id = 'idUsuarios';
	user.email = 'idUsuarios@gmail.com';
	const doc = new Documento();
	doc.id = 'd1';
	doc.isPlanDeAccion = false;
	doc.emisor = user;
	doc.estado = 'rechazado';
    const checklist = new Checklist();
    const configuracion = new ConfiguracionChecklist();
	configuracion.needPlanDeAccion = true;
    checklist.configuracion = configuracion;	
    doc.checklist = checklist;
	return doc
}

export function documentoIS(): Documento {

    const checklist = new Checklist();
    checklist.abreviatura = 'IS';
    
    const user = new Integrante();
    user.id = 'idUsuarios';
    user.email = 'idUsuarios@gmail.com';
    
    const doc = new Documento();
    doc.id = 'd1';
    doc.isConCuadrilla = true;
    doc.isAutoValidado = true;
    doc.isPlanDeAccion = false;
    doc.emisor = user;
    doc.estado = 'generado';

    // Crear integrantes adicionales
    const integrante1 = new Integrante();
    integrante1.isFirmado = true;
    integrante1.email = 'integrante1@gmail.com';
	integrante1.id = 'idIntegrante1';
    
    const integrante2 = new Integrante();
    integrante2.isFirmado = true;
    integrante2.email = 'integrante2@gmail.com';

    // Crear validadores
    const validador1 = new Integrante();
    validador1.id = 'idValidador1';
    validador1.email = 'validador1@gmail.com';
    
    const validador2 = new Integrante();
    validador2.id = 'idValidador2';
    validador2.email = 'validador2@gmail.com';


    // La creación de Checklist se omite ya que no es relevante para la cuadrilla

    const cuadrilla = new Cuadrilla();
    cuadrilla.id = 'idCuadrilla';
    cuadrilla.nombre = 'Nombre de la Cuadrilla';


    
    // Añadir integrantes y validadores a las listas correspondientes
    cuadrilla.integrantes = [integrante1, integrante2];
    cuadrilla.validadores = [validador1, validador2];

    // Agregar la cuadrilla al documento
    doc.cuadrilla = cuadrilla;
    doc.checklist = checklist;

    return doc;
}