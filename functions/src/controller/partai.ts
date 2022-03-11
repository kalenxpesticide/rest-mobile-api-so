import * as firebaseHelper from 'firebase-functions-helper/dist'
import * as authentication from '../authentication'
import * as express from 'express'
import { db } from '../config'

const app = express.Router();
const partaiCollection = 'partai';

interface PartaiContent {
    type: String,
    arena: String,
    blueSideGroup: String,
    blueSideName: String,
    index: String,
    redSideGroup: String,
    redSideName: String,
    tournamentClass: String,
}
interface Partai {
    tournamentId: String,
    tournamentName: String,
    partai: PartaiContent[],
}

//Add Partai
app.post('/' + partaiCollection, authentication.validateFirebaseIdToken, async (req, res) => {
    try {

        const partai = req.body['partai'];
        const partais: Partai = {
            tournamentId: req.body['tournamentId'],
            tournamentName: req.body['tournamentName'],
            partai: [],
        }
        for (let index = 0; index < partai.length; index++) {
            partais.partai.push({
                type: partai[index]['type'],
                arena: partai[index]['arena'],
                blueSideGroup: partai[index]['blueSideGroup'],
                blueSideName: partai[index]['blueSideName'],
                index: partai[index]['index'],
                redSideGroup: partai[index]['redSideGroup'],
                redSideName: partai[index]['redSideName'],
                tournamentClass: partai[index]['tournamentClass'],
            });
        }

        await firebaseHelper.firestoreHelper.createDocumentWithID(db, partaiCollection, req.body['tournamentId'], partais);
        res.status(201).send(`Created a new partai at: ${req.body['tournamentId']}`);
    } catch (error) {
        res.status(400).send(error);
    }
})

// Update Partai
app.post('/'+ partaiCollection +'/:tournamentId', authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const updatedDoc = await firebaseHelper.firestoreHelper.updateDocument(db, partaiCollection, req.params.tournamentId, req.body);
        res.status(204).send(`Update a new partai: ${updatedDoc}`);
    } catch (error) {
        res.status(400).send(`Partai can not be updated!!!`);
    }
})

// Get Partai By Tournament Id
app.get('/' + partaiCollection +'/:tournamentId', (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, partaiCollection, req.params.tournamentId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get partai: ${error}`));
})

export { app }