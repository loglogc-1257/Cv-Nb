const request = require('request');

function sendMessage(senderId, message, pageAccessToken) {
  if (!message || (!message.text && !message.attachment && !message.buttons)) {
    console.error('❌ Erreur : Le message doit contenir du texte, une pièce jointe ou des boutons.');
    return;
  }

  const payload = {
    recipient: { id: senderId },
    message: {}
  };

  if (message.text) {
    payload.message.text = message.text;
  }

  if (message.attachment) {
    payload.message.attachment = message.attachment;
  }

  if (message.buttons) {
    payload.message.attachment = {
      type: "template",
      payload: {
        template_type: "button",
        text: message.text || "Clique sur un bouton ci-dessous :",
        buttons: message.buttons
      }
    };
  }

  request({
    url: 'https://graph.facebook.com/v13.0/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: payload,
  }, (error, response, body) => {
    if (error) {
      console.error('❌ Erreur lors de l\'envoi du message :', error);
    } else if (response.body.error) {
      console.error('⚠️ Réponse avec erreur :', response.body.error);
    } else {
      console.log('✅ Message envoyé avec succès :', body);
    }
  });
}

module.exports = { sendMessage };
