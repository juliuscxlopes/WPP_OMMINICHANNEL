// src/Services/welcomeService/welcomeService.js
const redis = require('../../redisClient');
const sendGreetingMessage = require('../../whatsapp/sendGreetingMessage');
const sendCNPJMessage = require('../../whatsapp/sendCNPJMessage');
const { sendClientVerificationMessage } = require('../../whatsapp/sendVerifyClienteMessage');
const { sendConsultorMessage } = require('../../whatsapp/sendConsultorVendasMessage');
const validateCNPJ = require('../../utils/validationCNPJ');

const welcomeService = async (contact, text) => {
  try {
    switch (contact.step) {
      case 'welcome':
        await sendGreetingMessage(contact.phoneNumber);
        await sendClientVerificationMessage(contact.phoneNumber);
        contact.step = 'awaitClientVerification';
        await redis.set(contact.whatsappId, JSON.stringify(contact));
        break;

      case 'awaitClientVerification':
        if (text.toLowerCase() === 'sim') {
          await sendCNPJMessage(contact.phoneNumber);
          contact.step = 'awaitCNPJ';
        } else {
          await sendConsultorMessage(contact.phoneNumber);
          contact.step = 'completed';
        }
        await redis.set(contact.whatsappId, JSON.stringify(contact));
        break;

        case 'awaitCNPJ':
          const cnpjValid = await validateCNPJ(text); // Valida o CNPJ
        
          if (cnpjValid) {
            contact.step = 'supportService';
            // TODO: Chamar serviço para buscar na base de dados os dados do cliente.
            await redis.set(contact.whatsappId, JSON.stringify(contact));
        
          } else {
            await sendInvalidCNPJMessage(contact.phoneNumber);
            contact.step = 'awaitCNPJ';
            await redis.set(contact.whatsappId, JSON.stringify(contact));
          }
        
          break;
        
      default:
        console.log('Passo não reconhecido no fluxo de boas-vindas:', contact.step);
    }
  } catch (error) {
    console.error('Erro no serviço de boas-vindas:', error);
    throw error;
  }
};

module.exports = welcomeService;
