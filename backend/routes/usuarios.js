const express = require('express');
const router = express.Router();
const usuariosController = require('../controller/usuariosController');

//api/usuarios

router.get('/datosMunicipios', usuariosController.getDeptosMunicipios);
router.post('/registro', usuariosController.registrarUsuario);
router.post('/confirmarUsuario', usuariosController.confirmarUsuario);
router.post('/logIn', usuariosController.LoginUsuario);
router.post('/token', usuariosController.verificarTiempoToken);
router.get('/perfilUsuario/:id', usuariosController.perfilUsuario);
router.get('/detallesVendedor/:id', usuariosController.detallesVendedor);
router.get('/suscripciones/:id', usuariosController.suscripcionesCliente);
router.post('/cancelarSuscripcion', usuariosController.cancelarSuscripcion);
router.post('/suscribirCategoria', usuariosController.suscribirCategoria);
router.post('/agregarFavorito', usuariosController.agregarFavorito);
router.post('/eliminarFavorito', usuariosController.eliminarFavorito);
router.post('/estadoFavorito', usuariosController.estadoFavorito);
router.get('/listaFavoritos/:id', usuariosController.listaFavoritos);

module.exports = router