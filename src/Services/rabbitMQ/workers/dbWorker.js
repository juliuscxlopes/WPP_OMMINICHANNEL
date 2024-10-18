/* // srtc/services/rabbitMQ/workers/dbworker.js

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

                    // Organizando o objeto a ser enviado para o banco de dados
                    const email = contact.email;
                    const title = contact.title;
                    const description = contact.description;
                    const additionalInfo =
                        `Chamado aberto por: ${contact.nameContact}` +
                        `Telefone da Abertura: ${contact.phoneNumber}` +
                        `Empresa: ${contact.name}` +
                        `CNPJ: ${contact.CNPJ}`;

                    // Exibir o objeto que será enviado ao banco de dados
                    console.log('Enviando dados para o banco:', {
                        email: email,
                        title: title,
                        description: description,
                        additionalInfo: additionalInfo
                    });

                    // Enviar as informações organizadas
                    const response = await axios.post(dbEndpoint, {
                        email: email,
                        title: title,
                        description: description,
                        additionalInfo: additionalInfo
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
 */