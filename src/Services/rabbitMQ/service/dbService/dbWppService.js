// srtc/services/rabbitMQ/service/dbService/dbWppService.js
const { getDBChannel } = require('../../config/rabbitMQ');
const dbQueue = require('../../config/queues').dbQueue; // Certifique-se de importar corretamente

async function AddqueuedbRegister(contact) {
    try {
        const channel = await getDBChannel();
        

        
        const sent = channel.sendToQueue(dbQueue.name, Buffer.from(JSON.stringify(contact)), { persistent: true });
        if (sent) {
            console.log('Mensagem enviada para a fila com sucesso:', contact);
        } else {
            console.error('Falha ao enviar a mensagem para a fila.');
        }

    } catch (error) {
        console.error('Erro ao enviar mensagem para a fila:', error);
    }
}

module.exports = { AddqueuedbRegister };
