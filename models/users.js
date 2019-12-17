const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }, 
            qty: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = function(product) {        
    const prodIdToBeChecked = product._id;
    const cartProdIndex = this.cart.items.findIndex(cartProd => {
        return cartProd.productId.toString() === prodIdToBeChecked.toString();
    })
    const updatedCart = [...this.cart.items];

    // Check if product is in cart already
    let newQty = 1;
    if (cartProdIndex >= 0) {
        // If in cart, add +1 to qty
        newQty = this.cart.items[cartProdIndex].qty + 1;
        updatedCart[cartProdIndex].qty = newQty;
    } else {
        // If not, add product w/ qty 
        updatedCart.push({productId: product._id, qty: newQty}) 
    } 

    // Set the user cart to the updated version
    this.cart.items = updatedCart;
    return this.save();     
}

userSchema.methods.removeFromCart = function(prodId) {
    // Products array with product to be removed gone.
    const productsToKeep = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString();
    })
    // Set to updatedCart for consistency.
    const updatedCart = productsToKeep;

    // Set the user cart to the updated version  
    this.cart.items = updatedCart;
    return this.save();
}

module.exports = mongoose.model('User', userSchema);