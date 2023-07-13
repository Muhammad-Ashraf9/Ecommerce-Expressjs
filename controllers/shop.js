const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = (req, res) => {
  Product.find({})
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Main Page",
        products: products,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProducts = (req, res) => {
  Product.find({})
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Main Page",
        products: products,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("user.cart.items", user.cart.items);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res) => {
  const productId = req.body.productId;
  req.user
    .addToCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postDeleteCartItem = (req, res) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId);
  res.redirect("/cart");
};
exports.postCreateOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { product: { ...item.productId }, quantity: item.quantity };
      });
      const newOrder = new Order({
        products: products,
        userId: user._id,
      });
      return newOrder.save();
    })
    .then(() => {
      req.user.cart.items = [];
      return req.user.save();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res) => {
  Order.find({ userId: req.user._id })
    .populate("userId")
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "orders Page",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        path: "/products",
        pageTitle: product.title,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
