// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { webhookController } = require('../controllers/webhookController');
const verificationController  = require('../controllers/verificationController');
const messageProcessor = require('../middleware/messageProcessor');
const statusProcessor = require('../middleware/statusProcessor');
const { createContactAtomo }  = require('../middleware/contactsAtomo');


// Middleware de processamento básico
router.post('/', messageProcessor, statusProcessor, webhookController);
router.post('/Atomo', createContactAtomo);

// Rota para verificação do webhook
router.get('/', verificationController.verifyWebhook);

module.exports = router;

