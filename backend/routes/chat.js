const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController');

//api/chat

router.post('/enviarMensaje', chatController.enviarMensaje);
router.get('/getListaChats/:id', chatController.getListaChats);
router.get('/getMensajes/:usuarioId/:personaId', chatController.getMensajes);
router.post('/borrarChat', chatController.borrarChat);

module.exports = router