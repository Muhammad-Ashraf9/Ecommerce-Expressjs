const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

//get

exports.getIndex = (req, res, next) => {
  Product.find({})
    .then((products) => {
      res.status(201).render("shop/index", {
        pageTitle: "Main Page",
        products: products,
        path: "/",
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getProducts = (req, res, next) => {
  Product.find({})
    .then((products) => {
      res.status(201).render("shop/index", {
        pageTitle: "Main Page",
        products: products,
        path: "/",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.status(201).render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .populate("userId")
    .then((orders) => {
      res.status(201).render("shop/orders", {
        path: "/orders",
        pageTitle: "orders Page",
        orders: orders,
      });
    })
    .catch((err) => {
      next(err);
    });
};

//post

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.status(201).render("shop/product-details", {
        path: "/products",
        pageTitle: product.title,
        product: product,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .addToCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};
exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId);
  res.redirect("/cart");
};
exports.postCreateOrder = (req, res, next) => {
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
      next(err);
    });
};
