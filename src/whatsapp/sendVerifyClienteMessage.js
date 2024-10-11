// src/whatsapp/sendVerifyClienteMessage.js
const sendMessage = require('../utils/messageSender');

const sendClientVerificationMessage = async (phoneNumber) => {
  const messageData = {
    type: 'text',
    text: {
      body: '✨ Você já é nosso cliente? Responda com "Sim" ou "Não".'
    }
  };

  await sendMessage(phoneNumber, messageData);
  console.log(`Client verification message sent to ${phoneNumber}`);
};

module.exports = { sendClientVerificationMessage };
