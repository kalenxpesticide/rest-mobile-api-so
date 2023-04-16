import * as firebaseHelper from "firebase-functions-helper/dist";
import * as authentication from "../authentication";
import * as express from "express";
import { db } from "../config";

const app = express.Router();
const configCollection = "config";

// Update Config
app.post("/" + configCollection + "/edit", authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const updatedDoc = await firebaseHelper.firestoreHelper.updateDocument(db, configCollection, req.body["id"], req.body);
        res.status(204).send(`Update a new ${configCollection}: ${updatedDoc}`);
    } catch (error) {
        res.status(400).send(`${configCollection} should only contains id, url_bo!!!`);
    }
})

// Get Config By Key
app.get("/" + configCollection + "/:id", (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, configCollection, req.params.id)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get ${configCollection}: ${error}`));
})

export { app }