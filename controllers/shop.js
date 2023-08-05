const fs = require("fs");
const path = require("path");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { createInvoice } = require("../createInvoice");
const PDFDocument = require("pdfkit");

//get

exports.getIndex = (req, res, next) => {
  const { page = 1, limit = 2 } = req.query;
  console.log(page, limit);
  try {
    const products = await Product.find({})
      .skip((page - 1) * limit)
      .limit(limit * 1); //*1 => string => number
    const productsCount = await Product.countDocuments({});
    res.status(201).render("shop/index", {
      pageTitle: "Main Page",
      products: products,
      currentPage: page,
      totalPages: Math.ceil(productsCount / limit),
      path: "/",
    });
  } catch (err) {
    next(err);
  }
};
exports.getProducts = async (req, res, next) => {
  const { page = 1, limit = 2 } = req.query;
  console.log(page, limit);
  try {
    const products = await Product.find({})
      .skip((page - 1) * limit)
      .limit(limit * 1); //*1 => string => number
    const productsCount = await Product.countDocuments({});
    res.status(201).render("shop/index", {
      pageTitle: "Main Page",
      products: products,
      currentPage: page,
      totalPages: Math.ceil(productsCount / limit),
      path: "/",
    });
  } catch (err) {
    next(err);
  }
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
exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findOne({ userId: req.user._id, _id: orderId })
    .populate("userId")
    .then((order) => {
      if (!order) res.redirect("/");
      const doc = new PDFDocument();
      doc.pipe(res);
      doc.text(`Invoice`, {
        width: 410,
        align: "center",
      });
      doc.text(`Order ID: ${order._id}`, {
        width: 410,
        align: "left",
      });
      order.products.forEach((product) => {
        doc.text(
          `product title: ${product.product.title}, product quantity: ${product.quantity}`,
          100,
          100,
          { width: 410, align: "left" }
        );
      });
      doc.end();
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
