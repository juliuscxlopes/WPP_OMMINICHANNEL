const redis = require('../redisClient');
const welcomeService = require('../Services/welcomeService/welcomeService');
const supportService = require('../Services/supportService/supportService');


const webhookController = async (req, res) => {
  const { contact, text } = req.processedData;

  try {

    if (text === 'Olá sou cliente Atomo e quero suporte') {

      console.log("funcionou")
      await welcomeService(contact);
      return res.sendStatus(200);
    }

    switch (contact.service) {

      case 'welcome':
        await welcomeService(contact, text);
        break;

      default:
        await welcomeService(contact, text);
        break;
    }
  } catch (error) {
    console.error('Erro ao processar o webhook:', /* error */);
  }

  res.sendStatus(200); // Sempre retornamos status 200
};

module.exports = { webhookController };
