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
        return db.collection('users')
        .updateOne(
            { _id: mongodb.ObjectID(id) },
            {
                $set: {
                    "cart" : {items: [{productId: mongodb.ObjectID(product._id), qty: 1}]}
                },
                $currentDate: { lastModified: true }
            }
        ) 
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