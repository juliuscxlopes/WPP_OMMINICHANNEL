// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { webhookController } = require('../controllers/webhookController');
const { supportService } = require('../Services/supportService/supportService');
const verificationController = require('../controllers/verificationController');
const messageProcessor = require('../middleware/messageProcessor');
const statusProcessor = require('../middleware/statusProcessor');


// Middleware de processamento básico
router.post('/', messageProcessor, statusProcessor, webhookController);

// Rota para verificação do webhook
router.get('/', verificationController.verifyWebhook);

module.exports = router;

