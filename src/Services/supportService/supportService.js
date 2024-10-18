// controllers/webhookController.js
const redis = require('../../redisClient');
const { createTicket } = require('../../API/millDeskApi/createTicket');
const {sendConfirmationMessage, sendDescriptionMessage , sendAddTitleMessage} = require('../../whatsapp/sendSupportMessage');

const SUPPORT_EXPIRATION = 180

const supportService = async (contact, text) => {    
    try {
      switch (contact.step) {
          case 'supportService':
              await sendAddTitleMessage(contact.phoneNumber);
              contact.step = 'Title';
              await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', SUPPORT_EXPIRATION);
            break;
          case 'Title':
            contact.title = (text);
            await sendDescriptionMessage(contact.phoneNumber);
            contact.step = 'Description';
            await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', SUPPORT_EXPIRATION);
            break;

          case 'Description':
            contact.description = (text);
            await sendConfirmationMessage (contact.phoneNumber);
            contact.step = 'completed';
            console.log ('Contato', contact);
            await createTicket(contact);
            //TODO: chamar attendente.. chamar um serviço que vai conectar o frontend com o chatbot.. 
            //TODO: Enviar as informações coletadas para a Base de dados chamar o Worker do rabbitMQ

            await redis.del(contact.whatsappId);
            
        }

    } catch (error) {
      console.error('Serviço de suporte falhou', error);
    }
  } 

module.exports =  supportService;
