const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Define a model to be managed by sequelize.
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;