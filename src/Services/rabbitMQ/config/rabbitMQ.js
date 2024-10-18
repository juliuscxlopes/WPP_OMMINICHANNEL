// srtc/services/rabbitMQ/config/rabbitMQ.js

const amqp = require('amqplib');

let connection;
let channel;
let dbChannel;  // Canal para o banco de dados

async function createRabbitMQConnection() {
    if (!connection) {
        try {
            // Conecta ao RabbitMQ usando a URL da variável de ambiente ou localhost
            connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            channel = await connection.createChannel();
            dbChannel = await connection.createChannel();  // Cria um canal para o banco de dados
            console.log('Conectado ao RabbitMQ');
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }
    return { connection, channel, dbChannel };  // Retorna o dbChannel
}

// Exporta uma função para garantir que a conexão e os canais estejam disponíveis
async function getRabbitMQChannel() {
    if (!channel) {
        await createRabbitMQConnection();
    }
    return channel;
}

// Função para obter o canal do banco de dados
async function getDBChannel() {
    if (!dbChannel) {
        await createRabbitMQConnection();
    }
    return dbChannel;
}

module.exports = { getRabbitMQChannel, getDBChannel };
