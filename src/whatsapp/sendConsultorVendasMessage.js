// src/whatsapp/sendConsultorVendasMessage.js
const sendMessage = require('../utils/messageSender');

const sendConsultorMessage = async (phoneNumber) => {
  const messageData = {
    type: 'text',
    text: {
      body: 'Sem problemas! Um consultor entrará em contato com você para ajudar. Por favor, aguarde um momento.'
    }
  };

  await sendMessage(phoneNumber, messageData);
  console.log(`Consultor message sent to ${phoneNumber}`);
};

module.exports = { sendConsultorMessage };
