require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');
const { analyzeImage } = require('./analyzeImage');

const commands = new Map();
const prefix = '-';

// Charger les commandes du dossier 'commands'
fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
  });

async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) return console.error('❌ Erreur : ID de l\'expéditeur invalide.');

  // Vérifier si un message contient une pièce jointe (image)
  if (event.message?.attachments) {
    const attachment = event.message.attachments[0];

    if (attachment.type === "image") {
      const imageUrl = attachment.payload.url;
      return analyzeImage(senderId, imageUrl, pageAccessToken);
    } else {
      return sendMessage(senderId, { text: "❌ Je ne peux analyser que des images pour le moment." }, pageAccessToken);
    }
  }

  // Vérifier si un message texte a été envoyé
  const messageText = event?.message?.text?.trim();
  if (!messageText) return console.log('ℹ️ Message reçu sans texte.');

  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');

  try {
    if (commands.has(commandName.toLowerCase())) {
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, sendMessage);
    } else {
      await commands.get('ai').execute(senderId, [messageText], pageAccessToken);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de la commande:`, error);
    await sendMessage(senderId, { text: error.message || '⚠️ Une erreur est survenue lors de l\'exécution de cette commande.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };
