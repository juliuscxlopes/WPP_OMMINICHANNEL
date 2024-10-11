const redis = require('../../redisClient');
const sendGreetingMessage = require('../../whatsapp/sendGreetingMessage');
const sendCNPJMessage = require('../../whatsapp/sendCNPJMessage');
const { sendClientVerificationMessage } = require('../../whatsapp/sendVerifyClienteMessage');
const { sendConsultorMessage } = require('../../whatsapp/sendConsultorVendasMessage');
const validateCNPJ = require('../../utils/validationCNPJ');

const WELCOME_EXPIRATION = 180;

const welcomeService = async (contact, text) => {
  try {
    // Verificar se estamos no passo de boas-vindas
    if (contact.step === 'welcome') {
      console.log('Executando serviço de boas-vindas...');
      await sendGreetingMessage(contact.phoneNumber);
      await sendClientVerificationMessage(contact.phoneNumber);
      contact.step = 'awaitClientVerification'; // Próximo passo definido
      await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);

    } else if (contact.step === 'awaitClientVerification') {
      // Verificar a resposta do cliente
      if (text.toLowerCase() === 'sim') {
        await sendCNPJMessage(contact.phoneNumber);
        contact.step = 'awaitCNPJ'; // Próximo passo para verificar o CNPJ
      } else {
        await sendConsultorMessage(contact.phoneNumber);
        contact.step = 'completed'; // Fluxo encerrado
      }
      await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);

    } else if (contact.step === 'awaitCNPJ') {
      // Validar o CNPJ fornecido
      const cnpjValid = await validateCNPJ(text);
      
      if (cnpjValid) {
        contact.step = 'supportService'; // O fluxo avança para o suporte
        // Aqui você pode adicionar lógica para buscar informações na base de dados
      } else {
        await sendInvalidCNPJMessage(contact.phoneNumber);
        // Mantemos o passo como 'awaitCNPJ' para solicitar o CNPJ novamente
      }
      await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);

    } else {
      console.log('Passo não reconhecido no fluxo de boas-vindas:', contact.step);
    }

  } catch (error) {
    console.error('Erro no serviço de boas-vindas:', error);
    throw error;
  }
};

module.exports = welcomeService;
