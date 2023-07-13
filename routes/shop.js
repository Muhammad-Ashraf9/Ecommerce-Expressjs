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
const { isAuthenticated } = require("../middleware/isAuth");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProductDetails);

router.get("/cart", isAuthenticated, getCart);

router.post("/cart", isAuthenticated, postCart);

router.post("/cart-delete-item", isAuthenticated, postDeleteCartItem);

router.post("/create-order", isAuthenticated, postCreateOrder);

router.get("/orders", isAuthenticated, getOrders);

module.exports = router;
