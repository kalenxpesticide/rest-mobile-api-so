import * as firebaseHelper from "firebase-functions-helper/dist";
import * as authentication from "../authentication";
import * as express from "express";
import { db } from "../config";

const app = express.Router();
const klasemenCollection = "klasemen";

interface Klasemen {
    id: String,
    groupIndex: String,
    kontingen: String,
    level: String,
    gold: number,
    silver: number,
    bronze: number
}

//Add Klasemen
app.post("/" + klasemenCollection, authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const klasemen: Klasemen = {
            id: req.body["id"],
            groupIndex: req.body["groupIndex"],
            kontingen: req.body["kontingen"],
            level: req.body["level"],
            gold: req.body["gold"],
            silver: req.body["silver"],
            bronze: req.body["bronze"],
        }

        await firebaseHelper.firestoreHelper.createDocumentWithID(db, klasemenCollection, req.body["id"], klasemen);
        res.status(201).send(`Created a new klasemen at: ${req.body["id"]}`);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Update Klasemen
app.post("/"+ klasemenCollection +"/:id", authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const updatedDoc = await firebaseHelper.firestoreHelper.updateDocument(db, klasemenCollection, req.params.id, req.body);
        res.status(204).send(`Update a new klasemen: ${updatedDoc}`);
    } catch (error) {
        res.status(400).send(`Klasemen can not be updated!!!`);
    }
})

// Get Klasemen By Jenjang Sekolah
app.get("/" + klasemenCollection +"/:groupIndex/:level", (req, res) => {
    firebaseHelper.firestoreHelper.queryData(db, klasemenCollection, [["groupIndex", "==", req.params.groupIndex], ["level", "==", req.params.level]])
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get klasemen: ${error}`));
})

export { app }