//srtc/services/rabbitMQ/service/dbService/dbWppService.js

const { getRabbitMQChannel } = require('../../config/rabbitMQ');
const dbQueue  = require('../../config/queues');

async function sendToQueue(contact) {
    try {
        const channel = await getRabbitMQChannel();

        // Certificar-se de que a fila existe usando a configuração centralizada
        await channel.assertQueue(dbQueue.name, dbQueue.options);

        const message = {
            email: contact.email,
            title: contact.title,
            description: contact.description,
            additionalInfo: `
                Chamado aberto por: ${contact.nameContact}\r\n
                Telefone da Abertura: ${contact.phoneNumber}\r\n
                Empresa: ${contact.name}\r\n
                CNPJ: ${contact.CNPJ}\r\n
            `
        };
        
        channel.sendToQueue(dbQueue.name, Buffer.from(JSON.stringify(message)), { persistent: true });

        console.log('Mensagem enviada para a fila:', message);

    } catch (error) {
        console.error('Erro ao enviar mensagem para a fila:', error);
    }
}

module.exports = { sendToQueue };
