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
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProductDetails);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postDeleteCartItem);

router.post("/create-order", isAuth, postCreateOrder);

router.get("/orders", isAuth, getOrders);

module.exports = router;
