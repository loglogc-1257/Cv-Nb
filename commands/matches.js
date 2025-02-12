const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

const API_KEY = 'eb9d27aa0f68d9336a9f4978a0409d46';

module.exports = {
  name: 'matches',
  description: 'Affiche les matchs de football les plus importants du jour.',
  usage: '-matches',
  author: 'coffee',

  async execute(senderId, args) {
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data } = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: { 'x-apisports-key': API_KEY },
        params: { date: today, timezone: 'Europe/Paris' },
      });

      const fixtures = data.response;

      if (!fixtures || fixtures.length === 0) {
        await sendMessage(senderId, { text: 'Aucun match important prévu pour aujourd\'hui.' }, pageAccessToken);
        return;
      }

      // Format the match details
      let message = '⚽ **Matchs importants du jour** ⚽\n\n';
      fixtures.slice(0, 10).forEach((fixture) => {
        const { teams, league, fixture: matchDetails } = fixture;
        message += `📅 ${matchDetails.date.slice(11, 16)} | ${teams.home.name} 🆚 ${teams.away.name} (${league.name})\n`;
      });

      await sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs :', error);
      await sendMessage(senderId, { text: '❌ Erreur : Impossible de récupérer les matchs du jour.' }, pageAccessToken);
    }
  },
};
