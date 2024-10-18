const express = require('express');
const dotenv = require('dotenv');
const webhookRoutes = require('./routes/webhookRoutes');

// Importa o worker do RabbitMQ
const { processQueue } = require('./Services/rabbitMQ/workers/dbWorker');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/webhook', webhookRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
    // Inicia o worker do RabbitMQ
    processQueue(); // Chama a função para iniciar a fila
});
