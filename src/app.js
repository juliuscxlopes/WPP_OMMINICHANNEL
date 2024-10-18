const express = require('express');
const dotenv = require('dotenv');
const webhookRoutes = require('./routes/webhookRoutes');

// Importa as funções para configurar RabbitMQ
const {setupQueuesAndExchange } = require('./Services/rabbitMQ/config/exchange');
const { processfilaDbContact } = require('./Services/rabbitMQ/workers/dbWorker');
const { consumeAttendantsQueue } = require('./Services/rabbitMQ/workers/dbSelectAttendants');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/webhook', webhookRoutes);

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    
    try {
        // Configura as filas e o exchange do RabbitMQ
        await setupQueuesAndExchange();
        console.log('Filas e exchange configurados com sucesso.');
        processfilaDbContact();
        consumeAttendantsQueue();

    } catch (error) {
        console.error('Erro ao configurar filas e exchange:', error);
    }
});
