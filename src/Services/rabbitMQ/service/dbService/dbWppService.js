//srtc/services/rabbitMQ/service/dbService/dbWppService.js

const { getRabbitMQChannel } = require('../../config/rabbitMQ');
const dbQueue  = require('../../config/queues');

async function sendToQueue(contact) {
    try {
        const channel = await getRabbitMQChannel();
        await channel.assertQueue(dbQueue.name, dbQueue.options);
        console.log(channel)


        const message = {
            nameContact: contact.nameContact,
            phoneNumber: contact.phoneNumber,
            name: contact.name,
            cnpj: contact.CNPJ,
            email: contact.email,
            title: contact.title,
            description: contact.description    
        };
        
        const sent = channel.sendToQueue(dbQueue.name, Buffer.from(JSON.stringify(message)), { persistent: true });
        if (sent) {
            console.log('Mensagem enviada para a fila com sucesso:', message);
        } else {
            console.error('Falha ao enviar a mensagem para a fila.');
        }

    } catch (error) {
        console.error('Erro ao enviar mensagem para a fila:', error);
    }
}

module.exports = { sendToQueue };
