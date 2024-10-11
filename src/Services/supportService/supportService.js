// controllers/webhookController.js
const redis = require('../../redisClient');
const { createTicket } = require('../../API/millDeskApi/createTicket');
const {sendConfirmationMessage, sendDescriptionMessage , sendAddTitleMessage} = require('../../whatsapp/sendSupportMessage');

const SUPPORT_EXPIRATION = 180

const supportService = async (req, res, next) => {
  const { type } = req.processedData;

  if (type === 'message') {
    const { contact, text } = req.processedData;
    
    try {
      switch (contact.step) {
          case 'supportService':
              await sendAddTitleMessage(contact.phoneNumber);
              contact.step = 'awaitTitle';
              await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', SUPPORT_EXPIRATION);
            break;
          case 'awaitTitle':
            contact.title = (text);
            await sendDescriptionMessage(contact.phoneNumber);
            contact.step = 'awaitSuport';
            await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', SUPPORT_EXPIRATION);
            break;

          case 'awaitSuport':
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
  } else if (type === 'status') {
    const { id, status } = req.processedData;
    console.log(`Message ID: ${id}, Status: ${status}`);
  }

  res.sendStatus(200);
};

module.exports =  supportService;
