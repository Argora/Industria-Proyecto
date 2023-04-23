const express = require('express');
const router = express.Router();
const notificacionesControler = require('../controller/notificacionesController');

router.post('/nuevoSuscriptor/:id', notificacionesControler.nuevoToken);

module.exports = router
