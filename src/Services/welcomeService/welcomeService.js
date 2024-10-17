// src/Services/welcomeService/welcomeService.js
const redis = require('../../redisClient');
const sendGreetingMessage = require('../../whatsapp/sendGreetingMessage');
const {   sendCNPJMessage, sendInvalidCNPJMessage } = require('../../whatsapp/sendCNPJMessage');
const { validateCNPJ } = require('../../utils/validationCNPJ');
const { integrateContact } = require('../welcomeService/integrateContact')


const WELCOME_EXPIRATION = 180;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const welcomeService = async (contact, text) => {
  
  console.log('Iniciando serviço de boas-vindas...');
  console.log('Contact recuperado do Redis:', contact);
  console.log('Text recebido:', text);

  try {
    switch (contact.step) {
      case '':
        console.log('Executando serviço de boas-vindas...');
        await sendGreetingMessage(contact);
        await delay(1000);
        await sendCNPJMessage(contact.phoneNumber);
        contact.step = 'CNPJ';
        contact.service = 'welcome'
        console.log('service e step atualizado no redis.. ')
        await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);

        break;

      case 'CNPJ':
        const cnpjValid = await validateCNPJ(text);
        if (cnpjValid) {
          console.log('CNPJ VALIDO')
          // O CNPJ é válido, chamamos o serviço integrateContact
          const updatedContact = await integrateContact(text, contact);

          if (updatedContact) {
              console.log('Contato integrado com sucesso! Informações atualizadas no Redis.');
              console.log('TODO: Chamaremos o serviço de suporte ou outro serviço aqui!');

          } else {
              console.log('Nenhum contato correspondente ao CNPJ encontrado no Redis.');
          }
        } else {
          await sendInvalidCNPJMessage(contact.phoneNumber);
          contact.step = 'CNPJ';
          await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
        }
        break;

      default:
        console.log('Passo não reconhecido no fluxo de boas-vindas:', contact.step);
    }

    await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
    console.log('Status atualizado no Redis:', contact.step);
  } catch (error) {
    console.error('Erro no serviço de boas-vindas:', error);
    throw error;
  }
};

module.exports = welcomeService;
