const redisClient = require('../redisClient'); // Supondo que já temos o redisClient configurado

const createContactAtomo = async (req, res, next) => {
    const { nome, cnpj, email } = req.body;

    if (!cnpj || !nome || !email) {
        return res.status(400).json({ error: 'CNPJ, Nome, and Email are required' });
    }

    try {
        // Criar o objeto de contato com as informações recebidas
        const contactWeb = {
            name: nome,
            email: email,
            CNPJ: cnpj,
        };

        // Usar o CNPJ como chave no Redis (ou outro identificador que preferir)
        await redisClient.set(cnpj, JSON.stringify(contactWeb));

        console.log(`Contato criado no Redis: ${JSON.stringify(contactWeb)}`);
        res.status(200).send('Contato criado com sucesso!');

        next();

    } catch (error) {
        console.error('Erro ao criar contato Atomo:', error);
        res.status(500).json({ error: 'Erro ao criar contato Atomo' });
    }
};

module.exports = { createContactAtomo };
