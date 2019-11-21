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

// exports.getOrders = (req, res, next) => {
//     // Get orders from db > display
//     // Uses 'EAGER LOADING'
//     req.user.getOrders({ include: ['products'] })
//     .then(orderProducts => {                                   
//         res.render('shop/orders', {
//             path: '/orders', 
//             docTitle: 'My Orders',
//             orderProducts: orderProducts,  
//             productCSS: true,
//             formCSS: true,
//         }); 
//     })
//     .catch(err => console.log(err))
// };

// exports.postOrder = (req, res, next) => { 
//     let fetchedCart;
    
//     // Access cart.
//     req.user.getCart()
//     .then(cart => {
//         fetchedCart = cart;

//         // Get products through cart.
//         return cart.getProducts();
//     })
//     .then(products => {
//         // Create order in order table
//         return req.user.createOrder()
//         .then(order => {
//             // Add all products linked in the cart table to the order table
//             order.addProduct(
//                 // Map is used to cycle through everything in the array.
//                 // Could also use a for loop here but map is cleaner.
//                 products.map(product => {
//                     // orderItem and all its functions is apparently accessible from product as it is associated with it.
//                     // Here we directly modify the qty field for each product in the orderItem connector table.
//                     // The qty here is accessed throught the supplied cartItem on every product.
//                     // I think this is possible because I created an order through its connection with the user.
//                     product.orderItem = {qty: product.cartItem.qty };          
//                     return product;
//                 })
//             )
//         })
//     })
//     .then(() => {
//         return fetchedCart.setProducts(null);
//     })
//     .then(() => {
//         res.redirect('/orders')
//     })
//     .catch(err => console.log(err))
// };

