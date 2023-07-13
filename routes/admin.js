const express = require("express");

const path = require("path");

const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");

const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

// //    /admin/add-product get

router.get("/add-product", isAuth, getAddProduct);

// //    /admin/add-product post
router.post("/add-product", isAuth, postAddProduct);

// //    /admin/products get
router.get("/products", isAuth, getAdminProducts);

// //    /admin/edit-product get
router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", isAuth, postEditProduct);

router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
