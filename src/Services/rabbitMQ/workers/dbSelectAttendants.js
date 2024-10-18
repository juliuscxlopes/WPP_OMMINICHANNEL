// srtc/services/rabbitMQ/workers/attendantWorker.js

const { getDBChannel } = require('../../config/rabbitMQ');
const attendantsQueue = require('../../config/queues').attendantsQueue;
const axios = require('axios');

const DB_API_URL = process.env.DB_API_URL || 'http://localhost:3000'; 

async function consumeAttendantsQueue() {
    const channel = await getDBChannel();

    // Consumir a fila
    await channel.consume(attendantsQueue.name, async (msg) => {
        if (msg !== null) {
            const contact = JSON.parse(msg.content.toString());
            
            try {
                const response = await axios.post(`${DB_API_URL}/atendentes/solicitar`, contact);
                channel.ack(msg);
                console.log('Requisição enviada à API com sucesso:', contact);
            } catch (error) {
                console.error('Erro ao enviar a solicitação para a API:', error.message);
                channel.nack(msg, false, false);
            }
        }
    });
}

consumeAttendantsQueue();
