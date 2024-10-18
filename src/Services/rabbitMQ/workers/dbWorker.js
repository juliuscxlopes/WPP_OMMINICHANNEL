//srtc/services/rabbitMQ/workers/dbworker.js

const { getRabbitMQChannel } = require('../config/rabbitMQ');
const { dbQueue } = require('../config/queues');
const axios = require('axios');

async function processQueue() {
    try {
        const channel = await getRabbitMQChannel();

        // Certificar-se de que a fila existe usando a configuração centralizada
        await channel.assertQueue(dbQueue.name, dbQueue.options);

        console.log('Aguardando mensagens na fila', dbQueue.name);

        // Consumindo mensagens da fila
        channel.consume(dbQueue.name, async (msg) => {
            if (msg !== null) {
                const contact = JSON.parse(msg.content.toString());

                try {
                    const dbEndpoint = process.env.DB_ENDPOINT;

                    const response = await axios.post(dbEndpoint, {
                        email: contact.email,
                        title: contact.title,
                        description: contact.description,
                        additionalInfo: contact.additionalInfo
                    });

                    console.log('Dados enviados com sucesso para o banco:', response.data);
                    
                    // Acknowledge a mensagem
                    channel.ack(msg);

                } catch (error) {
                    console.error('Erro ao enviar dados para o banco:', error);
                }
            }
        }, { noAck: false });

    } catch (error) {
        console.error('Erro ao processar fila:', error);
    }
}

processQueue();
