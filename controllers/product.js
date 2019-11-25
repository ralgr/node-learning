const Product = require('../models/product');

exports.getShop = (req, res, next) => {
    Product.fetchAll()
    .then(products => {        
        res.render('shop/index', {
            prods: products, 
            path: '/', 
            docTitle: 'My Product List', 
            hasProds: products.length > 0, 
            productCSS: true,
            formCSS: true
        });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {        
        res.render('shop/product-list', {
            prods: products, 
            path: '/product-list', 
            docTitle: 'My Product List', 
            hasProds: products.length > 0, 
            productCSS: true,
            formCSS: true
        });
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {     
        res.render('shop/product-detail', {
            product: product,
            path: '/product-list', 
            docTitle: 'Product ' + prodId,  
            productCSS: true,
            formCSS: true,
        });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    console.log('Initialized get cart');
    
    req.user.getCart()
    .then(products => {
        res.render('shop/cart', {
            path: '/cart', 
            docTitle: 'My Cart',  
            productCSS: true,
            formCSS: true,
            cartProducts: products
        }); 
    })
    .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    
    // Search prod using ID
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(req.userId, product)        
    })
    .then(results => {
        console.log('Item added!');
        res.redirect('/product-list')  
    })
    .catch(err => {console.log(err)})
};

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.id;
    const userId = req.userId;
    
    req.user.deleteCartItem(prodId, userId)
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    const userId = req.userId;

    req.user.getOrders(userId)
    .then(ordersArray => {
        res.render('shop/orders', {
            path: '/orders', 
            docTitle: 'My Orders',
            orderProducts: ordersArray,  
            productCSS: true,
            formCSS: true,
        }); 
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => { 
    const userId = req.userId;

    req.user.addOrder(userId)
    .then(() => {
        res.redirect('/orders')
    })
    .catch(err => console.log(err))
};

