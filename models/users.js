const mongodb = require('mongodb') // Mainly used for creating BSON ID object 
const getDb = require('../util/mongo').getDb;

class User {   
    constructor(username, email, cart) {
        this.name = username,
        this.email = email,
        this.cart = cart
    }

    save() {
        const db = getDb(); 
        return db.collection('users')
        .insertOne(this)
        .catch(err => console.log(err))
    }

    addToCart(id, product) {
        const db = getDb();
        
        const prodIdToBeChecked = product._id;
        const cartItems = this.cart.items;
        const cartProdIndex = cartItems.findIndex(cartProd => {
            return cartProd.productId.toString() === prodIdToBeChecked.toString();
        })
        const updatedCart = [...cartItems];

        // Check if product is in cart already
        let newQty = 1;
        if (cartProdIndex >= 0) {
            // If in cart, add +1 to qty
            newQty = cartItems[cartProdIndex].qty + 1;
            updatedCart[cartProdIndex].qty = newQty;
        } else {
            // If not, add product w/ qty 
            updatedCart.push({productId: mongodb.ObjectID(product._id), qty: newQty}) 
        }
        
        return db.collection('users')
        .updateOne(
            { _id: mongodb.ObjectID(id) },
            {
                $set: {
                    "cart" : {items: updatedCart}
                },
                $currentDate: { lastModified: true }
            }
        )     
    }

    getCart() {
        const db = getDb();

        // Get ids 
        const cartItems = this.cart.items;
        const productIds = cartItems.map(item => {
            // Returns an array of IDs
            return item.productId;
        });
        
        return db.collection('products')
        .find({ 
            // Find multiple items via ID array using $in.
            _id : {
                $in: productIds
            } 
        })
        .toArray()
        .then(productsArray => {
           return productsArray.map(product => {
                return {
                    ...product,
                    qty: cartItems.find(item => {
                        return product._id.toString() === item.productId.toString()
                    }).qty
                }
            })
        })
        .catch(err => console.log(err))
    }

    deleteCartItem(id, userId) {
        const db = getDb();
        // Filter items in cart using id
        // delete item
        const cartItems = this.cart.items;
        const productsToKeep = cartItems.filter(item => {
            return item.productId.toString() !== id.toString();
        })

        return db.collection('users')
        .updateOne( 
            { _id : mongodb.ObjectID(userId) },
            {
                $set: { cart: {items: productsToKeep} },
                $currentDate: { lastModified: true }
            }
        );
    }

    addOrder(userId) {
        const db = getDb();  
        
        // Get ids 
        const cartItems = this.cart.items;
        const productIds = cartItems.map(item => {
            return item.productId;
        });
        
        // Code same as getCart()
        // Copied for inter-decoupling
        return db.collection('products')
        .find({ 
            _id : {
                $in: productIds
            } 
        })
        .toArray()
        .then(productsArray => {
           return productsArray.map(product => {
                return {
                    ...product,
                    qty: cartItems.find(item => {
                        return product._id.toString() === item.productId.toString()
                    }).qty
                }
            })
        })
        .then(detailedProductObjectArray => {
            // Arranging orders to include user info
            const orderedProducts = {
                items: detailedProductObjectArray,
                user: {
                    _id: mongodb.ObjectID(userId),
                    name: this.name
                }
            }

            // Insert arranged order to order collections
            return db.collection('orders')
            .insertOne(orderedProducts)        
        })
        .then(() => {
            // Clear cart 
            // No coupling since still uses users model
            return db.collection('users')
            .updateOne( 
                { _id : mongodb.ObjectID(userId) },
                {
                    $set: { cart: {items: []} },
                    $currentDate: { lastModified: true }
                }
            );
        })
        .catch(err => console.log(err))
    }

    getOrders(userId) {
        const db = getDb();

        return db.collection('orders')
        .find({
            "user._id" : mongodb.ObjectID(userId)
        })
        .toArray()
        .then(ordersArray => {
            return ordersArray
        })
        .catch(err => console.log(err))
    }

    static findById(id) {
        const db = getDb();       
        return db.collection('users')
        .findOne( { _id : mongodb.ObjectID(id) } )
        .then(user => {
            return user
        })
        .catch(err => console.log(err))  
    }
}

module.exports = User;