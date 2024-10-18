// srtc/services/rabbitMQ/workers/dbworker.js

const { getRabbitMQChannel } = require('../config/rabbitMQ');
const { dbQueue } = require('../config/queues');
const axios = require('axios');

async function processQueue() {
    try {
        const channel = await getRabbitMQChannel();

        // Certificar-se de que a fila existe usando a configuração centralizada
        await channel.assertQueue(dbQueue.name, dbQueue.options);

        console.log(`Worker iniciado. Aguardando mensagens na fila: ${dbQueue.name}`);

        // Consumindo mensagens da fila
        channel.consume(dbQueue.name, async (msg) => {
            if (msg !== null) {
                console.log('Mensagem recebida na fila:', msg.content.toString());

                const contact = JSON.parse(msg.content.toString());
                try {
                    const dbEndpoint = process.env.DB_ENDPOINT;

                    const nameContact = contact.nameContact;
                    const phoneNumber = contact.phoneNumber;
                    const name = contact.name;
                    const cnpj = contact.CNPJ;
                    const email = contact.email
                    const title = contact.title;
                    const description = contact.description;

                    // Enviar as informações organizadas
                    const response = await axios.post(dbEndpoint, {
                        email: email,
                        title: title,
                        description: description,
                    });

                    console.log('Dados enviados com sucesso para o banco:', response.data);
                    
                    // Acknowledge a mensagem
                    channel.ack(msg);
                    console.log('Mensagem confirmada (ack).');

                } catch (error) {
                    console.error('Erro ao enviar dados para o banco:', error);
                }
            } else {
                console.log('Nenhuma mensagem disponível na fila.');
            }
        }, { noAck: false });

    } catch (error) {
        console.error('Erro ao processar fila:', error);
    }
}

module.exports = { processQueue };
