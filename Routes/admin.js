const express = require('express');
const router = express.Router();

const adminController = require('../Controllers/admin');

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products',adminController.getProducts);

router.get('/edit-product/:productID', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product',adminController.postDeleteProduct);

module.exports = router;