const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Main Page",
      products: products,
      path: "/",
    });
  });
};
exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  Product.fetchAll((products) => {
    res.render("shop/products-list", {
      pageTitle: "Shop",
      products: products,
      path: "/products",
    });
  });
};

exports.getCart = (req, res) => {
  res.render("shop/cart", { path: "/cart", pageTitle: "cart Page" });
};
exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, product.price);
  });
  res.render("shop/cart", { path: "/cart", pageTitle: "cart Page" });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", { path: "/orders", pageTitle: "orders Page" });
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("shop/product-details", {
      path: "/products",
      pageTitle: product.title,
      product: product,
    });
  });
};
