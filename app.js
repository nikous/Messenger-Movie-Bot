'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const movieData = require('./controllers/movieData');
require('dotenv').config({ path: 'variables.env' });
const { VERIFY_TOKEN } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    // req.query contains the URL query param (after the ? in the URL)
    // Parse the query params
    let VERIFY_TOKEN = 'nicks-messenger';
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    //check if a token and monde is in the query string
    if (mode && token) {

        //Check if mode and token is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // When recieve weebHook event,you must always return a 200 ok HTTP response
            res.status(200).send(challenge);

        } else {

            //Responds with 403 forbidden if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

const messageWebhook = require('./controllers/message-webhook');

app.post('/', messageWebhook);
app.post('/get-movie-details', movieData);
app.listen(process.env.PORT || 6005, () => console.log("Webhook server is listening at 2"));