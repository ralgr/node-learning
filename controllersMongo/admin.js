const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/admin-product-list', {
            prods: products, 
            path: '/admin/admin-product-list', 
            docTitle: 'My Admin Product List', 
            hasProds: products.length > 0, 
            productCSS: true,
            formCSS: true
        });
    })
    .catch(err => {
        console.log(err);
        
    })
};

exports.getAddProduct = (req, res, next) => {    
    // Response can be sent using the 'send' method added by express.
    // Using this automatically sets the content type to whatever is inside.
    // Note that it can contain a data body of type 'any'.
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

    // For use with templating engines
    res.render('admin/edit-product', {
        docTitle: 'Add Product', 
        path: '/admin/edit-product', 
        formCSS: true,
        productCSS: true,
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.userId;    
    const product = new Product(title, price, description, imageUrl, userId);

    product.save()
    .then(() => {
        console.log('Created product ' + title);
        
        return res.redirect('/admin/admin-product-list'); 
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getEditProduct = (req, res, next) => {     
    // Query parameters can be checked in the 'req'.
    // 'Edit' below is a query key value pair. 
    const editMode = req.query.edit; 

    if (!editMode) {
        return res.redirect('/');
    }

    // Product ID
    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product => {
        if (!product) {
            return res.redirect('/');
        }

        res.render('admin/edit-product', {
            docTitle: 'Add Product', 
            path: '/admin/edit-product', 
            formCSS: true,
            productCSS: true,
            editing: editMode,
            product: product
        });
    })
    .catch(err => {
        console.log(err);
        
    });
};

exports.postEditProduct = (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const productId = req.body.productId;

    Product.update(productId, updatedTitle, updatedPrice, updatedDescription, updatedImageUrl)
    .then(() => {
        res.redirect('/admin/admin-product-list');
    })
    .catch(err => {
        console.log(err);
    })
};

// Should delete items in cart in addition to the database
exports.postDeleteProduct = (req, res, next) => {   
    const productId = req.body.id;
    const userId = req.userId;

    Product.deleteById(productId)
    .then(() => {
        console.log('Destroy complete');
        // Delete item on cart as well
        req.user.deleteCartItem(productId, userId)

        res.redirect('/admin/admin-product-list');
    })
    .catch(err => {
        console.log(err);
    })
};



