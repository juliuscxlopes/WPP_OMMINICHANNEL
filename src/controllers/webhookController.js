const redis = require('../redisClient');
const welcomeService = require('../Services/welcomeService/welcomeService');
const supportService = require('../Services/supportService/supportService');

const WEBHOOK_EXPIRATION = 180


const webhookController = async (req, res) => {
  const { contact, text } = req.processedData;

  try {
    switch (contact.step) {
      case '':
        await welcomeService(contact, text);
        contact.step = 'welcome';
        await redis.set(contact.whatsappId, JSON.stringify(contact), 'EX', WELCOME_EXPIRATION);
        await supportService(req, res);
        break;

      // Aqui você pode adicionar mais casos quando o step tiver um valor
      default:
        // Lógica futura para outros steps
        break;
    }
  } catch (error) {
    console.error('Erro ao processar o webhook:', error);
  }

  res.sendStatus(200); // Sempre retornamos status 200
};

module.exports = { webhookController };
