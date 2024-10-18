//srtc/services/rabbitMQ/config/rabbitMQ.js

const amqp = require('amqplib');

let connection;
let channel;

async function createRabbitMQConnection() {
    if (!connection) {
        try {
            // Conecta ao RabbitMQ usando a URL da variável de ambiente ou localhost
            connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            channel = await connection.createChannel();
            console.log('Conectado ao RabbitMQ');
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }
    return { connection, channel };
}

// Exporta uma função para garantir que a conexão e o canal estejam disponíveis
async function getRabbitMQChannel() {
    if (!channel) {
        await createRabbitMQConnection();
    }
    return channel;
}

module.exports = { getRabbitMQChannel };
