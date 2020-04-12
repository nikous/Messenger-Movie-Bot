const fetch = require('node-fetch');
const { FACEBOOK_ACCESS_TOKEN } = process.env;
const { KEY } = process.env;
let Genre = 18;
let Year = 2000;

const sendMovie = async (userID, event) => {

    const api_url = 'http://api.themoviedb.org/3/movie/' + event.id + '/videos?api_key=' + { KEY }.KEY + '';
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    const video = json.results[0];
    var key;
    if (video === undefined) {

        key = "no+trailer"

    } else {

        key = json.results[0].key;
    }

    return fetch(

        `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {

        headers: {

            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({

            messaging_type: 'RESPONSE',
            recipient: {

                id: userID,
            },
            message: {

                attachment: {

                    type: 'template',
                    payload: {

                        template_type: 'generic',
                        elements: [{

                            title: event.title,
                            image_url: 'https://image.tmdb.org/t/p/w500/' + event.poster_path + '',
                            subtitle: event.overview,
                            default_action: {

                                type: 'web_url',
                                url: 'https://www.youtube.com/watch?v=' + key + '',
                                webview_height_ratio: 'full'
                            },
                            buttons: [{

                                "type": "postback",
                                "title": "Find something  else",
                                "payload": "SearchAgain"

                            }]
                        }]
                    }
                }
            },
        }),
    })
}


const MovieApi = async (userID, genre, year, req, res) => {

    Genre = genre;
    Year = year;
    const user = userID;
    const api_url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + { KEY }.KEY + '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=' + year + '&with_genres=' + genre + '';
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json()
    const length = Object.keys(json.results).length;
    var randomNum = Math.floor(Math.random() * (length - 1 + 1)) + 1;

    sendMovie(user, json.results[randomNum]);
}

const findGenre = async (userID, wordGenre, realYear) => {

    const user = userID;
    const year = realYear;
    const api_url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + { KEY }.KEY + '&language=en-US';
    console.log(api_url)
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    let foundGenre = await json.genres.find(el => wordGenre === el.name)

    MovieApi(user, foundGenre.id, year);
}

const errorMessage = (userID, text) => {

    return fetch(

        `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {

        headers: {

            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({

            messaging_type: 'RESPONSE',
            recipient: {

                id: userID,
            },
            message: {

                text,
            },
        }),
    }
    );
}


module.exports = (event) => {

    if (event.postback && event.postback.payload === 'SearchAgain') {

        MovieApi(event.sender.id, Genre, Year);

    } else {

        const array = ['Action',
            'Adventure',
            'Animation',
            'Comedy',
            'Crime',
            'Documentary',
            'Drama',
            'Family',
            'Fantasy',
            'History',
            'Horror',
            'Music',
            'Mystery',
            'Romance',
            'Science Fiction',
            'TV Movie',
            'Thriller',
            'War',
            'Western'];

        var string = event.message.text;
        var words = string.split(' ');
        var found;
        var word3;
        if (words.length == 3) {

            word3 = words[1].charAt(0).toUpperCase() + words[1].slice(1)
            found = array.find(el => word3 === el);

        } else if (words.length == 4) {
            
            var word6 = words[1].charAt(0).toUpperCase() + words[1].slice(1)
            var word4 = words[2].charAt(0).toUpperCase() + words[2].slice(1)
            var word5 = word6.concat(" ");
            word3 = word5.concat(word4);
            found = array.find(el => word3 === el);
            console.log(found)
            words[2] = words[3];

        }

        const CurrentYear = new Date().getFullYear();

        if (Number(words[2]) < 2000 || Number(words[2] > CurrentYear)) {

            errorMessage(event.sender.id, 'The year you typed is wrong.Please enter a valid year between 1900 and ' + CurrentYear + ' ')

        } else if (found === undefined) {

            errorMessage(event.sender.id, "The genre you wrote doesn't exist or you didn't type space defore and/or after genre, also only first letter must be uppercase .Please try again")

        } else if (words.length == 1) {

            errorMessage(event.sender.id, "Please be careful with the spaces between the words.The correct is \n ? Genre Year")

        } else {

            findGenre(event.sender.id, word3, words[2])
        }
    }
}

