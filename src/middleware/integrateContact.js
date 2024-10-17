const redis = require('../redisClient');

// Configurações para as tentativas de busca
const MAX_ATTEMPTS = 5;  // Máximo de tentativas
const RETRY_INTERVAL = 2000;  // Intervalo entre tentativas em milissegundos (1 segundo)

const integrateContactWithRetry = async (req, res, next) => {
    const { phoneNumber, CNPJ, Nome, Email } = req.body; // Supondo que esses dados vêm no corpo da requisição

    if (!phoneNumber) {
        return res.status(400).json({ error: 'phoneNumber is required' });
    }

  let attempts = 0;
  let contactData;

  // Função para tentar buscar o contato no Redis
  const fetchContact = async () => {
    attempts++;

    try {
      contactData = JSON.parse(await redis.get(phoneNumber));

      if (contactData) {
        // Se encontrou, atualize o contato
        contactData.CNPJ = CNPJ || contactData.CNPJ; 
        contactData.Nome = Nome || contactData.Nome; 
        contactData.Email = Email || contactData.Email; 
        await redis.set(phoneNumber, JSON.stringify(contactData));
        req.updatedContact = contactData;
        next();
      } else {
        if (attempts < MAX_ATTEMPTS) {
          // Se não encontrou, esperar e tentar novamente
          console.log(`Tentativa ${attempts} falhou. Tentando novamente...`);
          setTimeout(fetchContact, RETRY_INTERVAL);
        } else {
          // Se atingiu o limite de tentativas, retornar erro
          console.error('Máximo de tentativas atingido. Contato não encontrado no Redis.');
          return res.status(404).json({ error: 'Contact not found after multiple attempts' });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar o contato no Redis:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  fetchContact();
};

module.exports = integrateContactWithRetry;
