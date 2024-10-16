const redis = require('../redisClient');
const welcomeService = require('../Services/welcomeService/welcomeService');
const supportService = require('../Services/supportService/supportService');

const WEBHOOK_EXPIRATION = 180


const webhookController = async (req, res) => {
  const { contact, text } = req.processedData;

  try {
    switch (contact.service) {
      case '':

        await welcomeService(contact, text);

        break;

      case 'welcome':

        await welcomeService(contact, text);

        break;


      default:
        // Lógica futura para outros steps
        break;
    }
  } catch (error) {
    console.error('Erro ao processar o webhook:', /* error */);
  }

  res.sendStatus(200); // Sempre retornamos status 200
};

module.exports = { webhookController };
