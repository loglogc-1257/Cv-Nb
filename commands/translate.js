const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const apiUrl = 'https://libretranslate.com/translate';

module.exports = {
  name: 'translate',
  description: 'Traduisez un texte dans une autre langue.',
  usage: 'translate [langue cible] [texte]',
  async execute(senderId, args) {
    if (args.length < 2) {
      return sendMessage(senderId, { text: 'Usage: translate [langue cible] [texte]' }, token);
    }

    const targetLang = args[0];
    const text = args.slice(1).join(' ');

    try {
      const { data } = await axios.post(apiUrl, { q: text, source: 'auto', target: targetLang, format: 'text' }, { headers: { 'Content-Type': 'application/json' } });
      await sendMessage(senderId, { text: `🈯 **Traduction** : ${data.translatedText}` }, token);
    } catch (error) {
      await sendMessage(senderId, { text: '❌ Erreur lors de la traduction.' }, token);
    }
  }
};
