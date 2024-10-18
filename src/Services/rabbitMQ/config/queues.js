//srtc/services/rabbitMQ/config/queues.js

module.exports = {
    dbQueue: {
        name: 'dbQueue',
        options: {
            durable: true, 
        },
    },
    // Caso precise de mais filas, você pode adicioná-las aqui
    anotherQueue: {
        name: 'anotherQueue',
        options: {
            durable: true,
        },
    },
};
