//srtc/services/rabbitMQ/config/queues.js

module.exports = {
    dbQueue: {
        name: 'dbQueue',
        options: {
            durable: true, 
        },
    },

    attendantsQueue: {  // Fila de atendentes
        name: 'attendantsQueue',
        options: {
            durable: true,
        },
    },
};

