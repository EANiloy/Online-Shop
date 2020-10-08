const { Sequelize, TIME } = require('sequelize');
const sequelize = new Sequelize('online-shop', 'root', 'mysqlroot', { dialect: 'mysql', host: 'localhost',timezone:'+06:00',dialectOptions:{useUTC:false}});

module.exports = sequelize;