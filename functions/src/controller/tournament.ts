import * as firebaseHelper from 'firebase-functions-helper/dist'
import * as authentication from '../authentication'
import * as express from 'express'
import { db } from '../config'

const app = express.Router();
const tournamentsCollection = 'tournaments';

interface Tournament {
    id: String,
    name: String,
    image: String,
    location: String,
}

// Add new Tournament
app.post('/' + tournamentsCollection, authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const tournament: Tournament = {
            id: req.body['id'],
            name: req.body['name'],
            image: req.body['image'],
            location: req.body['location']
        }

        await firebaseHelper.firestoreHelper.createDocumentWithID(db, tournamentsCollection, req.body['id'], tournament);
        res.status(201).send(`Created a new tournament: ${req.body['id']}`);
    } catch (error) {
        res.status(400).send(`Tournament should only contains id, name, image and location!!!`);
    }
})

// Update Tournament
app.post('/' + tournamentsCollection + '/:tournamentId', authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const updatedDoc = await firebaseHelper.firestoreHelper.updateDocument(db, tournamentsCollection, req.params.tournamentId, req.body);
        res.status(204).send(`Update a new tournament: ${updatedDoc}`);
    } catch (error) {
        res.status(400).send(`Tournament should only contains id, name, image and location!!!`);
    }
})

// Get Tournament By Id
app.get('/' + tournamentsCollection + '/:tournamentId', (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, tournamentsCollection, req.params.tournamentId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get tournament: ${error}`));
})

// View all tournaments
app.get('/' + tournamentsCollection, (req, res) => {
    firebaseHelper.firestoreHelper.queryData(db, tournamentsCollection, [["id", "!=", "0"]] , ["id"] )
        //.backup(tournamentsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get tournament: ${error}`));
})

// Delete tournament by id
app.delete('/' + tournamentsCollection + '/:tournamentId', authentication.validateFirebaseIdToken, async (req, res) => {
    try {
        const deletedTournament = await firebaseHelper.firestoreHelper
            .deleteDocument(db, tournamentsCollection, req.params.tournamentId);
        res.status(204).send(`Tournament is deleted: ${deletedTournament}`);
    } catch (error) {
        res.status(400).send(`Tournament ${req.params.tournamentId} can not be delete`);
    }
})

export { app }