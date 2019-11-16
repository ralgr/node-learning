// >>  Bellow code is without Sequelize  <<
// Utility function to connect to the database.

// const mysql = require('mysql2');

// 2 ways of connecting with SQL db:
// >> Set up 1 connection to run queries
// Always close a connection when finished with a query.
// Downside will be that the code needs to be re-executed for every new query.
// >> Creating a connection pool
// Will allow constant connection to the database whenever there are queries to be run.
// Get a new connection for every query from the pool(manages multiple connections) to
// run multiple queries simultaneously. Once a query is done, the connection is returned 
// to the pool and be available again for a new query.

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'nodecomplete'
// });

// Exporting with 'promise()' allows the use of promises.

// module.exports = pool.promise();

// >> Below code is using Sequelize <<
const Sequelize = require('sequelize');

// Sequelize instance
// Needs options: dbname, uname, pw, and an options object;
// Dialect to set lang pref. Host is defaulted to localhost but explicitly done here just for example.
const sequelize = new Sequelize('node-complete', 'root', 'nodecomplete', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;
