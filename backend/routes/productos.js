//Rutas productos
const express = require('express');
const router = express.Router();
const productoController = require('../controller/productoController');
const multer = require("../config/multer.config.js");

//api/productos
router.get('/getAll', productoController.getProductos);
router.get('/detalles/:id', productoController.getProductoDetalle)
router.post('/nuevoProducto/:id',multer.cargarArchivo.array('imagenesProducto',4),productoController.nuevoProducto);
router.get('/datosregistroProducto',productoController.getAll_categorias);

module.exports = router