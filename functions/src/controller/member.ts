import * as firebaseHelper from "firebase-functions-helper/dist";
import * as authentication from "../authentication";
import * as express from "express";
import { db } from "../config";

const app = express.Router();
const memberCollection = "member";

interface MemberContent {
    name: String,
    kontingen: String,
    indexing: String,    
}
interface Member {
    groupIndex: String,
    member: MemberContent[],
}

//Add Member
app.post("/" + memberCollection, authentication.validateFirebaseIdToken, async (req, res) => {
    try {

        const member = req.body["member"];
        const members: Member = {
            groupIndex: req.body["groupIndex"],
            member: [],
        }
        for (let index = 0; index < member.length; index++) {
            members.member.push({
                name: member[index]["name"],
                kontingen: member[index]["kontingen"],
                indexing: member[index]["indexing"],
            });
        }

        await firebaseHelper.firestoreHelper.createDocumentWithID(db, memberCollection, req.body["groupIndex"], members);
        res.status(201).send(`Created a new member at: ${req.body["groupIndex"]}`);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Update Member
app.post("/"+ memberCollection +"/:groupIndex", authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const updatedDoc = await firebaseHelper.firestoreHelper.updateDocument(db, memberCollection, req.params.groupIndex, req.body);
        res.status(204).send(`Update a new member: ${updatedDoc}`);
    } catch (error) {
        res.status(400).send(`Member can not be updated!!!`);
    }
})

// Get Member By GroupIndex
app.get("/" + memberCollection +"/:groupIndex", (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, memberCollection, req.params.groupIndex)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get member: ${error}`));
})

export { app }