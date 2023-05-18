const express = require("express");

const {
  getProducts,
  getIndex,
  getCart,
  getProductDetails,
  getOrders,
  postCart,
  postDeleteCartItem,
  postCreateOrder,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProductDetails);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", postDeleteCartItem);

router.post("/create-order", postCreateOrder);

router.get("/orders", getOrders);

module.exports = router;
