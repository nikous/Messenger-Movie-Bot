const fetch = require('node-fetch');
const dialogflow = require('dialogflow');

//ProjectId is in Dialogflow agent settings
const projectId = 'messenger-bot-nmtwqv';
const sessionId = '123456';
const languageCode = 'en-US';
const { FACEBOOK_ACCESS_TOKEN } = process.env;

const config = {

    credentials: {

        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
};

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const sendTextMessage = (userId, text) => {

    return fetch(

        `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,{
            
        headers: {

                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({

                messaging_type: 'RESPONSE',
                recipient: {

                    id: userId,
                },
                message: {

                    text,
                },
            }),
        }
    );
}

module.exports = (event) => {

    const userId = event.sender.id;
    const message = event.message.text;
    const request = {

        session: sessionPath,
        queryInput: {

            text: {

                text: message,
                languageCode: languageCode,
            },
        },
    };

    sessionClient
        .detectIntent(request)
        .then(responses => {

            let result = responses[0].queryResult.fulfillmentText

            if (result == "") {

                result = responses[0].queryResult.fulfillmentMessages[0].text.text[0];
            }

            return sendTextMessage(userId, result);
        })
        .catch(err => {
            
            console.error('ERROR:', err);
        });
}