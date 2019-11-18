const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ralgr:Uks26mfnCm9iLpcw@cluster0-hxxdm.mongodb.net/shop?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// This will contain the db connection after connecting to mongoDB.
// This was introduced to prevent the scenario where every query would 
// open a connection to the database. It was also stated that these conn.
// would not be closed after.
let _db;

// Inital mongoDB connection.
const mongoConn = callback => {
    client.connect()
    .then(client => {
        console.log('MongoDB connected');
        // Storing database connection
        _db = client.db();

        // Supplied callback
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

// Export that returns access to the db if available.
const getDb = () => {      
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConn = mongoConn;
exports.getDb = getDb;
