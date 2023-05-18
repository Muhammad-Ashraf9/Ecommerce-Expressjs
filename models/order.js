const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
});
module.exports = Order;
