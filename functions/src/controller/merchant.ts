import * as firebaseHelper from "firebase-functions-helper/dist";
import * as authentication from "../authentication";
import * as express from "express";
import { db } from "../config";
import { buildResponse } from "../entity/baseresponse";

const app = express.Router();
const merchantsCollection = "merchants";

/*interface Merchant {
    id: String,
    name: String,
    address: String,
    phone: String,
    email: String,
    pic: String,
    quota: number,
}

// Add new Merchant
app.post("/" + merchantsCollection, authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const merchant: Merchant = {
            id: req.body["id"],
            name: req.body["name"],
            address: req.body["address"],
            phone: req.body["phone"],
            email: req.body["email"],
            pic: req.body["pic"],
            quota: 0,
        }

        await firebaseHelper.firestoreHelper.createDocumentWithID(db, merchantsCollection, req.body["id"], merchant);
        res.status(201).send(`Created a new merchant: ${req.body["id"]}`);
    } catch (error) {
        res.status(400).send(`Merchant should only contains id, name, address, phone, email, and pic!!!`);
    }
})*/

// Using Quota
app.post("/" + merchantsCollection + "/use/quota", authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        let merchant = await firebaseHelper.firestoreHelper.getDocument(db, merchantsCollection, req.body["id"])
        if(merchant == null) {
            res.status(200).send(buildResponse(null, 400, `Merchant ${req.body["id"]} not found`))
            return
        }

        if(merchant.quota < 1) {
            res.status(200).send(buildResponse(null, 400, `The quota of Merchant ${req.body["id"]} has run out`))
            return
        }

        merchant.quota = merchant.quota - 1;

        const updatedDoc = await firebaseHelper.firestoreHelper.updateDocument(db, merchantsCollection, req.body["id"], merchant);
        res.status(200).send(buildResponse(updatedDoc));
    } catch (error) {
        res.status(200).send(buildResponse(null, 400, `Merchant ${req.body["id"]} not found`));
    }
})

// Get Merchant By Id
app.get("/" + merchantsCollection + "/:id", (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, merchantsCollection, req.params.id)
        .then(doc => res.status(200).send(buildResponse(doc)))
        .catch(error => res.status(200).send(buildResponse(null, 400, `${req.params.id} not found`)));
})

// View all tournaments
app.get("/" + merchantsCollection, (req, res) => {
    firebaseHelper.firestoreHelper.queryData(db, merchantsCollection, [["id", "!=", "0"]] , ["id"] )
        //.backup(tournamentsCollection)
        .then(data => res.status(200).send(buildResponse(data)))
        .catch(error => res.status(200).send(buildResponse(null, 400, `Merchant not found`)));
})

export { app }