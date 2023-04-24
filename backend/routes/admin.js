const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.get('/getProductosAdmin', adminController.getProductosAdmin);
router.put('/actualizarProductoAdmin', adminController.actualizarProducto);
router.get('/getUsuariosAdmin', adminController.getUsuarios);
router.delete('/borrarUsuario/:id', adminController.borrarUsuario);
router.post('/registrarUsuarioAdmin', adminController.registrarUsuarioAdmin)
router.put('/actualizarUsuarioAdmin', adminController.actualizarUsuario);

module.exports = router;