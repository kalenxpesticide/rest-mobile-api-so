import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as partai from "./controller/partai";
import * as tournament from "./controller/tournament";
import * as klasemen from "./controller/klasemen";
import * as member from "./controller/member";
import * as config from "./controller/config";
import * as merchant from "./controller/merchant";

const main = express();
const prefix = "/api/v1";

main.use(prefix, partai.app);
main.use(prefix, tournament.app);
main.use(prefix, klasemen.app);
main.use(prefix, member.app);
main.use(prefix, config.app);
main.use(prefix, merchant.app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

export const webApi = functions.https.onRequest(main);