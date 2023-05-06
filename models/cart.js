const path = require("path");
const fs = require("fs");
const Product = require("./product");

const cartPath = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);
const readCartProductsFile = (callback) => {
  fs.readFile(cartPath, (err, cartProducts) => {
    let cart = { products: [], totalPrice: 0 };
    if (!err) {
      cart = JSON.parse(cartProducts);
    }
    callback(cart);
  });
};

module.exports = class Cart {
  static addProduct(productId, productPrice) {
    readCartProductsFile((cart) => {
      let existingProductIndex = cart.products.findIndex(
        (product) => product.id === productId
      );

      let existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: productId, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += productPrice;
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(productId, productPrice) {
    readCartProductsFile((cart) => {
      const updatedCart = { ...cart };
      const product = updatedCart.products.find(
        (product) => product.id === productId
      );
      console.log(product);
      updatedCart.products = updatedCart.Products.filter(
        (product) => product.id !== productId
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - product.quantity * productPrice;

      fs.writeFile(cartPath, JSON.stringify(updatedCart), (error) => {
        if (error) {
          console.log(error);
        }
      });
    });
  }
  static fetchAll(callback) {
    readCartProductsFile((cart) => {
      let cartProducts = cart;
      callback(cartProducts);
    });
  }
};
