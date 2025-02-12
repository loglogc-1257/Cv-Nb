const axios = require('axios');

module.exports = {
  name: 'matches',
  description: 'Affiche les matchs de football les plus importants du jour.',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const apiKey = 'eb9d27aa0f68d9336a9f4978a0409d46';
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: { 'x-apisports-key': apiKey },
        params: { date: today, timezone: 'Europe/Paris' },
      });

      const fixtures = response.data.response;

      if (fixtures.length === 0) {
        await sendMessage(senderId, { text: 'Aucun match important prévu pour aujourd\'hui.' }, pageAccessToken);
        return;
      }

      let message = 'Matchs importants du jour :\n\n';
      fixtures.forEach((fixture) => {
        const { teams, league, fixture: matchDetails } = fixture;
        message += `${matchDetails.date.slice(11, 16)} - ${teams.home.name} vs ${teams.away.name} (${league.name})\n`;
      });

      await sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs :', error);
      await sendMessage(senderId, { text: 'Une erreur est survenue lors de la récupération des matchs.' }, pageAccessToken);
    }
  },
};
