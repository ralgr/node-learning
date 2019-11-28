// const path = require('path');

const express = require('express');

// const rootDir = require('../util/path'); 
const adminCtrlr = require('../controllers/admin');

// Router similar to the created 'express()' app on app.js in that it can be used like it.
// 'get' and 'post' also available.
// Should  be exported for use in the main app.js file.
const router = express.Router();

// For both MWs, the same path can be used for both if the method differs.
// For instances where MW paths start with the same route as shown below where both start out at '/admin',
// add it instead as a filter, which can be done by including the 'route origin' as an argument before the 
// routes themselves. Can be seen on app.js. 
// The MW below will then be accessed at '/admin/add-product'.
// router.get('/edit-product', adminCtrlr.getAddProduct);
// router.post('/add-product', adminCtrlr.postAddProduct);

// router.get('/edit-product/:productId', adminCtrlr.getEditProduct);
// router.post('/edit-product', adminCtrlr.postEditProduct);

// router.post('/delete-product', adminCtrlr.postDeleteProduct);

// router.get('/admin-product-list', adminCtrlr.getAdminProducts);

module.exports = router;
