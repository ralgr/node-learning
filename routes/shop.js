// Another node core module
// const path = require('path');

const express = require('express');

// const rootDir = require('../util/path');
const prodCtrlr = require('../controllers/product');

const router = express.Router();

// Middlewares

// Shop
router.get('/', prodCtrlr.getShop);

// Products
router.get('/product-list', prodCtrlr.getProducts);

// Specific Product
// Express dynamic data prefaced by ':'
// Ordering matters when 2 middlewares share a base location and 1 of the MWs use dynamic data.
// Always put the dynamic last.
router.get('/product-list/:productId', prodCtrlr.getProduct);

// Cart
router.get('/cart', prodCtrlr.getCart);
router.post('/cart', prodCtrlr.postCart);
// router.post('/cart-delete-item', prodCtrlr.postDeleteCartItem);

// Orders
// router.get('/orders', prodCtrlr.getOrders);
// router.post('/create-order', prodCtrlr.postOrder);

module.exports = router;