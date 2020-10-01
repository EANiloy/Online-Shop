const express = require('express');
const router = express.Router();
const shopController = require('../Controllers/shop');


router.get('/', shopController.getIndex); 

router.get('/products',shopController.getProducts);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

router.get('/products/:productID',shopController.getProductDetails);


module.exports = router;