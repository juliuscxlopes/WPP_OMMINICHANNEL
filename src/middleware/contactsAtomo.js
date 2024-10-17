const redisClient = require('../redisClient'); // Supondo que já temos o redisClient configurado

const createContactAtomo = async (req, res, next) => {
    const { CNPJ, Nome, Email } = req.body;

    if (!CNPJ || !Nome || !Email) {
        return res.status(400).json({ error: 'CNPJ, Nome, and Email are required' });
    }

    try {
        // Criar o objeto de contato com as informações recebidas
        const contactWeb = {
            name: Nome,
            email: Email,
            CNPJ: CNPJ,
        };

        // Usar o CNPJ como chave no Redis (ou outro identificador que preferir)
        await redisClient.set(CNPJ, JSON.stringify(contactWeb));

        console.log(`Contato criado no Redis: ${JSON.stringify(contactWeb)}`);

        // Continuar para o próximo middleware ou controller
        next();

    } catch (error) {
        console.error('Erro ao criar contato Atomo:', error);
        res.status(500).json({ error: 'Erro ao criar contato Atomo' });
    }
};

module.exports = { createContactAtomo };
