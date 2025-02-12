const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8').trim();
const apiKey = 'd8228a911d6447f5802fea9988edbbf8';

module.exports = {
  name: 'news',
  description: 'Obtenez les dernières actualités.',
  usage: 'news [code du pays]',
  async execute(senderId, args) {
    const country = args[0] || 'fr'; // Par défaut France
    try {
      const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`);
      const articles = data.articles.slice(0, 3).map(a => `📰 **${a.title}**\n🔗 ${a.url}`).join('\n\n');
      
      await sendMessage(senderId, { text: articles || "Aucune actualité trouvée." }, token);
    } catch (error) {
      await sendMessage(senderId, { text: '❌ Erreur lors de la récupération des actualités.' }, token);
    }
  }
};
