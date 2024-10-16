// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { webhookController } = require('../controllers/webhookController');
const verificationController = require('../controllers/verificationController');
const messageProcessor = require('../middleware/messageProcessor');



// Middleware de processamento básico
router.post('/', messageProcessor, webhookController);

// Rota para verificação do webhook
router.get('/', verificationController.verifyWebhook);

module.exports = router;

