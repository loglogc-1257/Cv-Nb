const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();

module.exports = {
  name: 'define',
  description: 'Obtenez la définition d’un mot.',
  usage: 'define [mot]',
  async execute(senderId, args) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Veuillez entrer un mot. Exemple: define amour' }, token);
    }

    const word = args.join(' ');
    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const definition = data[0]?.meanings[0]?.definitions[0]?.definition || "Définition introuvable.";
      const message = `📖 **Définition de ${word}**\n\n${definition}`;

      await sendMessage(senderId, { text: message }, token);
    } catch (error) {
      await sendMessage(senderId, { text: '❌ Mot introuvable.' }, token);
    }
  }
};
