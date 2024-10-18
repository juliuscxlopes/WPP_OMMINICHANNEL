const welcomeService = require('../Services/welcomeService/welcomeService');
const supportService = require('../Services/supportService/supportService');


const webhookController = async (req, res) => {
  const { contact, text } = req.processedData;

  try {
    if (text === 'Olá sou cliente Atomo e quero suporte') {
      await welcomeService(contact);
      return res.sendStatus(200);
    }
    switch (contact.service) {
      case 'welcome':
        await welcomeService(contact, text);
        break;

      case 'Support':
        await supportService(contact, text);
        break;

      default:
        await welcomeService(contact, text);
        break;
        
    }
  } catch (error) {
    console.error('Erro ao processar o webhook:', /* error */);
  }
  console.log('encerrando o ciclo')
  res.sendStatus(200);
};

module.exports = { webhookController };
