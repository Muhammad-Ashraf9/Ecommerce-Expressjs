const Cart = require("./cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, description, price, imageUrl) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }
  save() {
    return db.execute(
      "INSERT INTO products (title,description,price,imageUrl) VALUES (?,?,?,?) ",
      [this.title, this.description, this.price, this.imageUrl]
    );
  }
  static deleteById(id) {}
  static fetchAll() {
    return db.execute("SELECT * FROM PRODUCTS");
  }
  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
