const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("node-complete", "root", "22788Ash", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
