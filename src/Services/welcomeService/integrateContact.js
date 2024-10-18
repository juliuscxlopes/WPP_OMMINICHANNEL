const redis = require('../../redisClient');


const integrateContact = async (text, contact) => {
    try {
        const contactWeb = await redis.get(text);
        if (contactWeb) {
            const parsedContactWeb = JSON.parse(contactWeb);
            contact.CNPJ = parsedContactWeb.CNPJ || contact.CNPJ;
            contact.name = parsedContactWeb.name || contact.name;
            contact.email = parsedContactWeb.email || contact.email;
            await redis.set(contact.whatsappId, JSON.stringify(contact));
            await redis.del(text);

            return contact;
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