
const fetch = require('node-fetch');
require('dotenv').config({ path: 'variables.env' });

const { KEY } = process.env;

const getMovie = async (req, res) => {

    const movieToSearch = req.body.queryResult.parameters.any.replace(/\s/g, '+');;
    const api_url = 'https://api.themoviedb.org/3/search/movie?api_key=' + { KEY }.KEY + '&query=' + movieToSearch + '';
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json()
    let dataToSend = ""    // Wait to fetch json from api

    if (json.results[0].original_title == undefined) {

        dataToSend = `The movie you search doesn't exist or you misspelled it.Please try again`;

    } else {

        dataToSend = `${json.results[0].original_title} overview: ${json.results[0].overview}\nRelease Date: ${json.results[0].release_date} \nPopularity: ${json.results[0].popularity}\nVote: ${json.results[0].vote_average}`;
    }

    res.json({

        "fulfillmentMessages": [{

            "text": {

                "text": [

                    dataToSend
                ]
            }
        }],
    })
};

module.exports = getMovie;
