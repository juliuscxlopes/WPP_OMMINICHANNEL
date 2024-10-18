// srtc/services/rabbitMQ/workers/dbworker.js

const { getDBChannel } = require('../../rabbitMQ/config/rabbitMQ');
const { dbQueue } = require('../config/queues');
const axios = require('axios');

async function processfilaDbContact() {
    try {
        const channel = await getDBChannel();
        await channel.assertQueue(dbQueue.name, dbQueue.options);
        console.log(`Worker iniciado. Aguardando mensagens na fila: ${dbQueue.name}`);
        channel.consume(dbQueue.name, async (msg) => {
            if (msg !== null) {
                console.log('Mensagem recebida na fila:', msg.content.toString());

                const contact = JSON.parse(msg.content.toString());
                try {
                    const dbEndpoint = process.env.DB_ENDPOINT;
                    const response = await axios.post(dbEndpoint, contact );
                    console.log('Dados enviados com sucesso para o banco:', response.data);
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

module.exports = { processfilaDbContact };
