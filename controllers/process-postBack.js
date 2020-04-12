const fetch = require('node-fetch');

const { FACEBOOK_ACCESS_TOKEN } = process.env;

const sendTextMessage1 = (userId, text) => {

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

                    attachment: {

                        type: 'template',
                        payload: {

                            template_type: 'generic',
                            elements: [{

                                title: 'Welcome!',
                                image_url: 'https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png',
                                subtitle: text,
                                default_action: {

                                    type: 'web_url',
                                    url: 'https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png',
                                    webview_height_ratio: 'tall'
                                },
                                buttons: [{

                                    type: 'web_url',
                                    url: 'https://cdn.pixabay.com/photo/2013/07/13/10/41/hat-157581_960_720.png',
                                    title: 'Check project'
                                },
                                {
                                    "type": "postback",
                                    "title": "Try Movie Bot",
                                    "payload": "TryMe"

                                }
                                ]
                            }]
                        }
                    }
                },
            }),
        }
    )
}

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

    // Get the payload for the postback
    let payload = event.postback.payload;

    if (payload === 'GET_STARTED') {

        sendTextMessage1(event.sender.id, 'I can help you find details of a movie or find a new movie to watch ');
    }
    if (payload === 'TryMe') {

        sendTextMessage(event.sender.id, 'You can find the best movies by genre for a spesific year,just type\n? Genre Year\n(i.e ? Drama 2018) . The types of genres are:\u000A Action\u000A Adventure\u000A Animation\u000A Comedy\u000A Crime\u000A Documentary\u000A Drama\u000A Family\u000A Fantasy\u000A History\u000A Horror\u000A Music\u000A Mystery\u000A Romance\u000A Science Fiction\u000A TV Movie\u000A Thriller\u000A War\u000A Western\u000AYou can also find details about a movie.Just type \n! MovieTitle \n(i.e ! Snatch)');
    }

}


