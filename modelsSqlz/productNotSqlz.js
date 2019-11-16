const Cart = require('./cart');
const db = require('../util/database');

// Helpers
// const getProdsFromFile = (cb) => {
    // The code below will not return anything because the return statements 
    // are inside an async function.
    // fs.readFile(filePath, (err, fileContent) => {
    //     if (err) {
    //         return [];
    //     }

    //     console.log(JSON.parse(fileContent));
            
    //     return JSON.parse(fileContent);
    // });

    // instead of a function that waits for data to be returned, you pass in this function directly 
    // to the method as a callback to do its procedures inside the would be async function, bypassing the need
    // for waiting for the async function to resolve and return data. 
    // fs.readFile(filePath, (err, fileContent) => {
        // if (err) {
            // cb([]);
        // } else {
            // cb(JSON.parse(fileContent));
        // };
    // });
// };

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.id = id;
    }
    
    save() {   
        return db.execute(
            'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]
        );
    };

    static delete(id) {

    }

    // 'static' makes sure that the function can be called directly on the class.
    static fetchAll() {
        return db.execute('SELECT * FROM products');
    };

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?',
        [id]);
    }
}