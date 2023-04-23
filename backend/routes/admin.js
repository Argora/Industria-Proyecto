const express = require('express');
const router = express.Router();
const adminContriller = require('../controller/adminController');

router.get('/getProductosAdmin', adminContriller.getProductosAdmin);
router.put('/actualizarProductoAdmin', adminContriller.actualizarProducto);

module.exports = router;