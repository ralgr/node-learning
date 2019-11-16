const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const filePath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetching previous cart
        fs.readFile(filePath, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);    
            }

            // Analyze cart for additions of product or increase qty.
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct; 

            // Add new prod or increase qty
            if (existingProduct) {
                updatedProduct = { ...existingProduct },
                updatedProduct.qty = updatedProduct.qty + 1;

                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;  
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(filePath, JSON.stringify(cart), err => console.log(err ? err : 'No err in adding to cart'));
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(filePath, (err, fileContent) => {   
            if (err) {
                return; 
            }

            // New cart for updating
            const cart = {...JSON.parse(fileContent)};
            // Get qty
            const productSearch = cart.products.find(p => p.id === id);   
            if (!productSearch) {
                return;
            }         
            const productQty = productSearch.qty;
            // Update total price
            cart.totalPrice = cart.totalPrice - +productPrice * productQty;
            // Delete item then update cart
            cart.products = cart.products.filter(p => p.id !== id);
            
            fs.writeFile(filePath, JSON.stringify(cart),  err => {
                console.log(!err ? 'No err in deleting on cart' : err)
            })
        })
    }

    static getCart(cb) {
        fs.readFile(filePath, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        }); 
    }
};