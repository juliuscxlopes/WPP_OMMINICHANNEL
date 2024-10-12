// src/Services/welcomeService/welcomeService.js
const redis = require('../../redisClient');
const sendGreetingMessage = require('../../whatsapp/sendGreetingMessage');
const sendCNPJMessage = require('../../whatsapp/sendCNPJMessage');
const { sendClientVerificationMessage } = require('../../whatsapp/sendVerifyClienteMessage');
const { sendConsultorMessage } = require('../../whatsapp/sendConsultorVendasMessage');
const validateCNPJ = require('../../utils/validationCNPJ');

const WELCOME_EXPIRATION = 180;

const welcomeService = async (contactId, text) => {
  try {
    // Recuperar o contact atualizado do Redis no início
    const contactData = await redis.get(contactId);
    let contact = contactData ? JSON.parse(contactData) : null;

    if (!contact) {
      console.log('Contato não encontrado no Redis.');
      return;
    }

    console.log('Iniciando serviço de boas-vindas...');
    console.log('Contact recuperado do Redis:', contact);
    console.log('Text recebido:', text);

    if (contact.step === 'welcome') {
      console.log('Executando serviço de boas-vindas...');
      await sendGreetingMessage(contact.phoneNumber);
      await sendClientVerificationMessage(contact.phoneNumber);
      contact.step = 'awaitClientVerification'; // Próximo passo definido
    } else if (contact.step === 'awaitClientVerification') {
      if (text.toLowerCase() === 'sim') {
        await sendCNPJMessage(contact.phoneNumber);
        contact.step = 'awaitCNPJ';
      } else {
        await sendConsultorMessage(contact.phoneNumber);
        contact.step = 'completed';
      }
    } else if (contact.step === 'awaitCNPJ') {
      const cnpjValid = await validateCNPJ(text);
      if (cnpjValid) {
        contact.step = 'supportService';
        // Chamar serviço para buscar dados do cliente
      } else {
        await sendInvalidCNPJMessage(contact.phoneNumber);
        contact.step = 'awaitCNPJ'; // Repete até o CNPJ ser válido
      }
    } else {
      console.log('Passo não reconhecido no fluxo de boas-vindas:', contact.step);
    }

    // Atualizar o Redis com o status mais recente
    await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
    console.log('Status atualizado no Redis:', contact.step);

  } catch (error) {
    console.error('Erro no serviço de boas-vindas:', error);
    throw error;
  }
};

module.exports = welcomeService;
