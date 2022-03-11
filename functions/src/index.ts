import * as functions from 'firebase-functions'
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as partai from './controller/partai'
import * as tournament from './controller/tournament'

const main = express();
const prefix = '/api/v1';

main.use(prefix, partai.app);
main.use(prefix, tournament.app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// webApi is your functions name, and you will pass main as 
// a parameter
export const webApi = functions.https.onRequest(main);



