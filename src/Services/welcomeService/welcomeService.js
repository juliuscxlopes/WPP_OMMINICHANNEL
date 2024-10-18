// src/Services/welcomeService/welcomeService.js
const redis = require('../../redisClient');
const sendGreetingMessage = require('../../whatsapp/sendGreetingMessage');
const { sendCNPJMessage, sendInvalidCNPJMessage } = require('../../whatsapp/sendCNPJMessage');
const { validateCNPJ } = require('../../utils/validationCNPJ');
const { integrateContact } = require('../welcomeService/integrateContact')
const supportService = require('../supportService/supportService');


const WELCOME_EXPIRATION = 180;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const welcomeService = async (contact, text) => {
  try {
    switch (contact.step) {
      case 'CNPJ':
        const cnpjValid = await validateCNPJ(text);
        if (cnpjValid) {
          const updatedContact = await integrateContact(text, contact);
          console.log('Aqui devemos ter outra verificação de CNPJ à base de clientes.. ')
          //chamar outra verificação de CNPJ para objter dados.. 
          if (updatedContact) {
              //TODO: Verificar e-mail na milldesk, se existe solicitante dele.. 
              console.log('Contato integrado com sucesso! Iniciando Serviço de Support');
              contact.step = 'supportService';
              contact.service = 'Support';
              await supportService(contact, text);
              await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
          } else {
              console.log('Nenhum contato correspondente ao CNPJ encontrado no Redis.');
          }
        } else {
          await sendInvalidCNPJMessage(contact.phoneNumber);
        }
        break;

      default:
        console.log('Executando serviço de boas-vindas...');
        await sendGreetingMessage(contact);
        await delay(1000);
        await sendCNPJMessage(contact.phoneNumber);
        contact.step = 'CNPJ';
        contact.service = 'welcome'
        console.log('service e step atualizado no redis.. ')
        await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
    }
    console.log('Fluxo de Boas-Vindas encerrou', contact);

  } catch (error) {
    console.error('Erro no Fluxo de boas-vindas:', error);
    throw error;
  }
};

module.exports = welcomeService;
