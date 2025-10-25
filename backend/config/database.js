// backend/config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./backend/database/database.sqlite",
    logging: false
});

module.exports = sequelize;
