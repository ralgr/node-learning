const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// Define a model to be managed by sequelize.
const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = CartItem;