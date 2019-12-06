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
    let cartItems = this.cart.items;
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
        updatedCart.push({productId: product._id, qty: newQty}) 
    }
     
    // Set the user cart to the updated version
    cartItems = updatedCart;

    return this.save();      
}

module.exports = mongoose.model('User', userSchema);