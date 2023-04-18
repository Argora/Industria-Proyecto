const express = require('express');
const router = express.Router();
const usuariosController = require('../controller/usuariosController');

//api/usuarios

router.get('/datosMunicipios', usuariosController.getDeptosMunicipios);
router.post('/registro', usuariosController.registrarUsuario);
router.post('/confirmarUsuario', usuariosController.confirmarUsuario);
router.post('/logIn', usuariosController.LoginUsuario);
router.post('/token', usuariosController.verificarTiempoToken);

module.exports = router