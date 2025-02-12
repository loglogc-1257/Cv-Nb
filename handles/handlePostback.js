const { sendMessage } = require('./sendMessage');

function handlePostback(event, pageAccessToken) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  let responseText;

  switch (payload) {
    case 'GET_STARTED':
      responseText = "👋 Bienvenue ! Je suis ton assistant IA. Tape *help* pour voir les commandes disponibles.";
      break;

    case 'HELP_MENU':
      responseText = "📜 *Commandes disponibles :*\n\n" +
                     "🔹 *!anime* - Infos sur un anime\n" +
                     "🔹 *!manga* - Trouver un manga\n" +
                     "🔹 *!imagine* - Générer une image IA\n" +
                     "🔹 *!music* - Écouter de la musique\n" +
                     "🔹 *!gpt* - Poser une question à l'IA\n" +
                     "🔹 *!tiktok* - Télécharger une vidéo TikTok\n" +
                     "🔹 *!pinterest* - Rechercher une image\n" +
                     "🔹 *!sing* - Chanter une chanson 🎤\n\n" +
                     "👉 Envoie une image pour l'analyser !";
      break;

    case 'IMAGE_ANALYZE':
      responseText = "📷 Envoie-moi une image, et je l'analyserai avec mon IA !";
      break;

    default:
      responseText = `🤔 Tu as cliqué sur un bouton inconnu : ${payload}`;
      break;
  }

  sendMessage(senderId, { text: responseText }, pageAccessToken);
}

module.exports = { handlePostback };
