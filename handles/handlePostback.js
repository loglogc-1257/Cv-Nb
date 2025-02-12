const { sendMessage } = require('./sendMessage');
const { execute } = require('../commands/matches');

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  switch (payload) {
    case 'MATCHES_TODAY':
      execute(senderId, [], pageAccessToken); // Exécuter la commande matches.js
      break;

    default:
      sendMessage(senderId, { text: `🤔 Tu as cliqué sur un bouton inconnu : ${payload}` }, pageAccessToken);
      break;
  }
}

module.exports = { handlePostback };
