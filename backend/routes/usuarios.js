const express = require('express');
const router = express.Router();
const usuariosController = require('../controller/usuariosController');

//api/usuarios

router.get('/datosMunicipios', usuariosController.getDeptosMunicipios);

module.exports = router