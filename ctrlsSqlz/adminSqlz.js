const Product = require('../models/product');

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

    // >> SQLZ <<
    // create creates and object based on the defined model and immediately saves it in the db.
    // build the object only and would require manual intervention to save to the db.
    // findOrCreate creates if it does not exist on the db and doesnt if it does not.
    // Product.findOrCreate({
    //     where: {title: title},
    //     defaults: {
    //         title: title,
    //         price: price,
    //         imageUrl: imageUrl,
    //         description: description
    //     }
    // })
    // .then(([user, created]) => {
    //     if (created) {           
    //         return res.redirect('/admin/admin-product-list');     
    //     } 

    //     return res.redirect('/admin/edit-product'); 
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // This method is available because of the association done in app.js
    // The 'create[any]' name is as it is because the associated model is called Product.
    // This automatically creates a db entry associated with the curr. user.
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
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

    Product.findByPk(prodId)
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

    // >> SQLZ <<
    Product.findByPk(productId)
    .then(product => {
        product.title = updatedTitle;
        product.price= updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;

        // save sqlz method takes the object as edited and saves it in the db.
        return product.save(); 
    })
    .then(() => {
        res.redirect('/admin/admin-product-list');
    })
    .catch(err => {
        console.log(err);
    })
};

exports.getAdminProducts = (req, res, next) => {
    req.user.getProducts()
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

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.id;

    // >> SQLZ <<
    Product.findByPk(productId)
    .then(product => {
        return product.destroy();
    })
    .then(() => {
        console.log('Destroy complete');
        res.redirect('/admin/admin-product-list');
    })
    .catch(err => {
        console.log(err);
    })

};