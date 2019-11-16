const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const filePath = path.join(rootDir, 'data', 'cart.json');

const Product = require('../models/product');

// The send file requires an absolute path, however the '/' is reserved for the root of the OS 
// so it cannot point to the views files.
// To do so, it requires the help of 'path', node.js core features. 
// Below, 'join' will result in an absolute path by concatenating the different segments.
// The first argument is a global variable made available by node.js, '__dirname'.
// This variable holds the absolute path on the OS to the project folder.
// res.sendFile(path.join(rootDir, 'views', 'shop.html')

exports.getProducts = (req, res, next) => {  
//    Product.fetchAll()
//    .then(([rows]) => {
//         // This is for use with the templating engine pug.
//         // render provided by express.
//         // Adding a 'layout' property and setting it to false will make sure that Hbs does not use the default layout.
//         // The first argument is the file to be rendered. 'shop' in this case.
        // res.render('shop/product-list', {
        //     prods: rows, 
        //     path: '/product-list', 
        //     docTitle: 'My Product List', 
        //     hasProds: rows.length > 0, 
        //     productCSS: true,
        //     formCSS: true
        // });
//    })
//    .catch(err => {
//        console.log(err);    
//    })

    // findALl can be configured by options
    // Results to an array.
    Product.findAll()
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

    Product.findByPk(prodId)
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
    
    // 'getCart' is used to access the table of carts in which the User table is associated with.
    // The name itself varies and comes in the order of 'get[modelName]'. In this case, the model 
    // associated with User is Cart.
    req.user.getCart()
    .then(cart => {                 
        // Does not make use of 'EAGER LOADING' which immediately loads the returned data with additional 
        // associated data inside an array. This is done by adding an include object like so: { include: ['tableName'] }.       
        return cart.getProducts();
    })
    .then(products => {        
        // Get id > use id to search in cart > get qty
      
        res.render('shop/cart', {
            path: '/cart', 
            docTitle: 'My Cart',  
            productCSS: true,
            formCSS: true,
            cartProducts: products
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQty = 1;

    // >> SQLZ <<
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;

        // Check if the product to be added is already in cart
        return cart.getProducts({ where: {id: prodId } })    
    })
    .then(products => {
        let product;

        if (products.length > 0) {
            product = products[0]
        }

        if (product) {
            newQty = 1 + product.cartItem.qty;
        }
        
        return Product.findByPk(prodId)
    })
    .then(product => {
        return fetchedCart.addProduct(product, { through: { qty: newQty } });
    })
    .then(() => {
        res.redirect('/product-list')
    })
    .catch(err => console.log(err))
};

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.id;
    
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({ where: {id: prodId } })
    })
    .then(products => {
        const product = products[0];

        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    // Get orders from db > display
    // Uses 'EAGER LOADING'
    req.user.getOrders({ include: ['products'] })
    .then(orderProducts => {                                   
        res.render('shop/orders', {
            path: '/orders', 
            docTitle: 'My Orders',
            orderProducts: orderProducts,  
            productCSS: true,
            formCSS: true,
        }); 
    })
    .catch(err => console.log(err))
};

exports.postOrder = (req, res, next) => { 
    let fetchedCart;
    
    // Access cart.
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;

        // Get products through cart.
        return cart.getProducts();
    })
    .then(products => {
        // Create order in order table
        return req.user.createOrder()
        .then(order => {
            // Add all products linked in the cart table to the order table
            order.addProduct(
                // Map is used to cycle through everything in the array.
                // Could also use a for loop here but map is cleaner.
                products.map(product => {
                    // orderItem and all its functions is apparently accessible from product as it is associated with it.
                    // Here we directly modify the qty field for each product in the orderItem connector table.
                    // The qty here is accessed throught the supplied cartItem on every product.
                    // I think this is possible because I created an order through its connection with the user.
                    product.orderItem = {qty: product.cartItem.qty };          
                    return product;
                })
            )
        })
    })
    .then(() => {
        return fetchedCart.setProducts(null);
    })
    .then(() => {
        res.redirect('/orders')
    })
    .catch(err => console.log(err))
};

exports.getShop = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            path: '/', 
            docTitle: 'My Shop', 
            hasProds: products.length > 0, 
            productCSS: true,
            formCSS: true
        });
    })
    .catch(err => {
        console.log(err);
        
    })
};
