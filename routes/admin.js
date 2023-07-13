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

const { isAuthenticated } = require("../middleware/isAuth");

const router = express.Router();

// //    /admin/add-product get

router.get("/add-product", isAuthenticated, getAddProduct);

// //    /admin/add-product post
router.post("/add-product", isAuthenticated, postAddProduct);

// //    /admin/products get
router.get("/products", isAuthenticated, getAdminProducts);

// //    /admin/edit-product get
router.get("/edit-product/:productId", isAuthenticated, getEditProduct);

router.post("/edit-product", isAuthenticated, postEditProduct);

router.post("/delete-product", isAuthenticated, postDeleteProduct);

module.exports = router;
