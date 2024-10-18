// srtc/services/rabbitMQ/config/exchange.js

const { getRabbitMQChannel } = require('./rabbitMQ');
const queues = require('./queues');

async function setupQueuesAndExchange() {
    const channel = await getRabbitMQChannel();

    // Nome do exchange
    const exchange = 'my_exchange'; 
    // Criação do exchange
    await channel.assertExchange(exchange, 'direct', { durable: true });

    // Criação da fila e vinculação ao exchange
    for (const queue of Object.values(queues)) {
        // Criação da fila
        await channel.assertQueue(queue.name, queue.options);
        // Vinculação da fila ao exchange usando o nome da fila como chave de roteamento
        await channel.bindQueue(queue.name, exchange, queue.name);
        console.log(`Fila '${queue.name}' criada e vinculada ao exchange '${exchange}'.`);
    }
}

// Exporta a função para ser chamada quando necessário
module.exports = { setupQueuesAndExchange };
