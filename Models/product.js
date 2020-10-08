const Sequelize = require('sequelize');

const sequelizeDb = require('../Helpers/database');

const Product = sequelizeDb.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull:false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull:false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull:false
    }
});

module.exports = Product;