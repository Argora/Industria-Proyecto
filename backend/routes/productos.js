//Rutas productos
const express = require('express');
const router = express.Router();
const productoController = require('../controller/productoController');

//api/productos
router.get('/getAll', productoController.getProductos);
router.get('/detalles/:id', productoController.getProductoDetalle)

module.exports = router