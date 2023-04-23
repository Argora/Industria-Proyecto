const express = require('express');
const router = express.Router();
const adminContriller = require('../controller/adminController');

router.get('/getProductosAdmin', adminContriller.getProductosAdmin);

module.exports = router;
