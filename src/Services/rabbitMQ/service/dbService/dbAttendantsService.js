// srtc/services/rabbitMQ/service/dbService/dbWppService.js

const { getDBChannel } = require('../../config/rabbitMQ');
const attendantsQueue = require('../../config/queues').attendantsQueue;

async function filadbAttendants(contact) {
    try {
        const channel = await getDBChannel();
        
        // Envia o objeto contact para a fila
        const sent = channel.sendToQueue(attendantsQueue.name, Buffer.from(JSON.stringify(contact)), { persistent: true });
        if (sent) {
            console.log('Contato enviado para a fila de atendentes com sucesso:', contact);
        } else {
            console.error('Falha ao enviar o contato para a fila.');
        }

    } catch (error) {
        console.error('Erro ao enviar mensagem para a fila de atendentes:', error);
    }
}

module.exports = { filadbAttendants };

