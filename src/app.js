const express = require('express');
const dotenv = require('dotenv');
const webhookRoutes = require('./routes/webhookRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/webhook', webhookRoutes);
//app.use('/CNPJ');

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



