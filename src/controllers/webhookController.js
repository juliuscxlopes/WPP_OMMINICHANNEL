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
          if (text === 'Olá sou cliente Atomo e quero suporte') {
            console.log('TODO:definir algoritimo.')
            //await supportService(contact);
          } else {
            // Lógica futura para outros steps
            console.log(`Mensagem não reconhecida: ${text}`);
          }
          break;
      }
    }
   catch (error) {
    console.error('Erro ao processar o webhook:', /* error */);
  }

  res.sendStatus(200); // Sempre retornamos status 200
};

module.exports = { webhookController };
