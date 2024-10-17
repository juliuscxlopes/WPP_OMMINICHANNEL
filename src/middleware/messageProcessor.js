const redis = require('../redisClient');
const { removeExtraNine } = require('../utils/phoneUtils'); // Importa a função que remove o dígito extra

const integrateContactWithRetry = async (req, res, next) => {
    const { phoneNumber, CNPJ, Nome, Email } = req.body; // Supondo que esses dados vêm no corpo da requisição

    if (!phoneNumber) {
        return res.status(400).json({ error: 'phoneNumber is required' });
    }

    let attempts = 0;
    let contactData;

    const formattedPhoneNumber = removeExtraNine(phoneNumber);
    const whatsappId = `whatsapp:${formattedPhoneNumber}`;

    const fetchContact = async () => {
        attempts++;
        contactData = await redis.get(whatsappId);

        if (contactData) {
            contactData = JSON.parse(contactData);

            contactData.CNPJ = CNPJ;
            contactData.Nome = Nome;
            contactData.Email = Email;

            await redis.set(whatsappId, JSON.stringify(contactData));

            // Avança para o próximo middleware ou controlador
            return next();
        } else if (attempts < 5) {
            // Se não encontrou o contato, tenta novamente até 5 vezes
            setTimeout(fetchContact, 1000); // Aguarda 1 segundo antes de tentar novamente
        } else {
            // Caso tenha excedido o número máximo de tentativas
            return res.status(404).json({ error: 'Contact not found after multiple attempts' });
        }
    };

    // Inicia a busca pelo contato
    fetchContact();
};

module.exports = { integrateContactWithRetry };
