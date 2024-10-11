// src/Services/welcomeService/welcomeService.js
const redis = require('../../redisClient');
const sendGreetingMessage = require('../../whatsapp/sendGreetingMessage');
const sendCNPJMessage = require('../../whatsapp/sendCNPJMessage');
const { sendClientVerificationMessage } = require('../../whatsapp/sendVerifyClienteMessage');
const { sendConsultorMessage } = require('../../whatsapp/sendConsultorVendasMessage');
const validateCNPJ = require('../../utils/validationCNPJ');

const WELCOME_EXPIRATION = 180


const welcomeService = async (req, res, next) => {
  const { contact, text, type } = req.processedData;

  if (type === 'message') {
    console.log('Evento ignorado, pois não é uma mensagem.');
    return;
  }

  try {
    switch (contact.step) {
      case 'welcome':
        console.log('Executando serviço de boas-vindas...');
        await sendGreetingMessage(contact.phoneNumber);
        await sendClientVerificationMessage(contact.phoneNumber);
        contact.step = 'awaitClientVerification';
        await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
        break;

      case 'awaitClientVerification':
        if (text.toLowerCase() === 'sim') {
          await sendCNPJMessage(contact.phoneNumber);
          contact.step = 'awaitCNPJ';
        } else {
          await sendConsultorMessage(contact.phoneNumber);
          contact.step = 'completed';
        }
        await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
        break;

        case 'awaitCNPJ':
          const cnpjValid = await validateCNPJ(text); // Valida o CNPJ
        
          if (cnpjValid) {
            contact.step = 'supportService';
            // TODO: Chamar serviço para buscar na base de dados os dados do cliente.
            await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
        
          } else {
            await sendInvalidCNPJMessage(contact.phoneNumber);
            contact.step = 'awaitCNPJ';
            await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
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
