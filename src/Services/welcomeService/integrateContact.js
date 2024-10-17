const integrateContact = async (text, contact) => {
    try {
        // Tentar buscar o contato web relacionado ao CNPJ (text) no Redis
        const contactWeb = await redisClient.get(text);

        if (contactWeb) {
            // Se encontrar o contactWeb, faz o parse do JSON
            const parsedContactWeb = JSON.parse(contactWeb);

            // Atualizar o objeto contact com as informações do contactWeb
            contact.CNPJ = parsedContactWeb.CNPJ || contact.CNPJ;
            contact.name = parsedContactWeb.name || contact.name;
            contact.email = parsedContactWeb.email || contact.email;

            // Atualizar o contato completo no Redis com o whatsappId como chave
            await redisClient.set(contact.whatsappId, JSON.stringify(contact));

            console.log(`Contato atualizado no Redis: ${JSON.stringify(contact)}`);

            // Excluir o registro contactWeb do Redis
            await redisClient.del(text);

            console.log(`Registro contactWeb para o CNPJ ${text} removido do Redis.`);

            return contact; // Retorna o contato atualizado
        } else {
            console.log(`Nenhum contato encontrado no Redis para o CNPJ: ${text}`);
            return null;
        }
    } catch (error) {
        console.error('Erro ao integrar o contato:', error);
        throw error;
    }
};

module.exports = { integrateContact };