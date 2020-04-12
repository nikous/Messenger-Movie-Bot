

const processMessage = require('./process-message');
const processPostBack = require('./process-postBack');
const findMovie = require('./findMovie');

module.exports = (req, res) => {

  if (req.body.object === 'page') {

    req.body.entry.forEach(entry => {

      entry.messaging.forEach(event => {

        if (event.message && (event.message.text).startsWith("?")) {

          findMovie(event);

        } else if (event.postback) {

          if (event.postback.payload === 'SearchAgain') {

            findMovie(event);

          } else {

            processPostBack(event);
          }

        } else if (event.message && event.message.text) {

          processMessage(event);
        }
      });
    });

    res.status(200).end();
  }
};

// module.exports = sendMessage;

