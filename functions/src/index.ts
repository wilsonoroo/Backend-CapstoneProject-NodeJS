// import {
	// flujo3, 
	// myfunction,
	// flujo, 
	// flujo1, 
// } from './functions'
import * as admin from 'firebase-admin';
// import { firestore } from 'firebase-admin';
import { myfunctionk } from './functions/flujoIS/test1';
// import { myfunctionk1 } from './functions/flujoIS/test2';
import { myfunction } from './functions';

admin.initializeApp();
// const db = firestore();



export const contando = myfunctionk;
// export const contando1 = myfunctionk1;
export const IS = myfunction;


