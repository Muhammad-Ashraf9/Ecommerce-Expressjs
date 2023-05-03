const express = require("express");

const path = require("path");

const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
} = require("../controllers/admin");

const router = express.Router();

//    /admin/add-product get

router.get("/add-product", getAddProduct);

//    /admin/add-product post
router.post("/add-product", postAddProduct);

//    /admin/products get
router.get("/products", getAdminProducts);

//    /admin/edit-product get
router.get("/edit-product", getEditProduct);

module.exports = router;
