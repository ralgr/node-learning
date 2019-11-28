const mongodb = require('mongodb')
const getDb = require('../util/mongo').getDb;

class Product { 
    constructor(title, price, description, imageUrl, userId) {
        this.title = title,
        this.price = price,
        this.description = description,
        this.imageUrl = imageUrl,
        this.userId = userId // To relate prod to user
    }

    save() {
        const db = getDb(); 
        return db.collection('products')
        .insertOne(this)
        .catch(err => console.log(err))
    }

    static update(id, title, price, description, imageUrl) {
        const db = getDb(); 
        return db.collection('products')
        .updateOne(
            { _id: mongodb.ObjectID(id) },
            {
                $set: {
                    "title" : title,
                    "price" : price,
                    "description" : description,
                    "imageUrl" : imageUrl
                },
                $currentDate: { lastModified: true }
            }
        )
    }

    static fetchAll() {
        const db = getDb(); 
        return db.collection('products')
        .find( {} )
        .toArray()
        .then(productsArray => {
            return productsArray
        })
        .catch(err => console.log(err))  
    }

    static findById(id) {        
        const db = getDb(); 
        
        return db.collection('products')
        .find( { _id : mongodb.ObjectID(id) } )
        .next()
        .then(product => {
            return product
        })
        .catch(err => console.log(err))  
    }

    static deleteById(id) {        
        const db = getDb(); 

        return db.collection('products')
        .deleteOne( { _id: mongodb.ObjectID(id) } )
    }
}

module.exports = Product;