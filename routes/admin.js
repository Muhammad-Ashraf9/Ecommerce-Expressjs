const { log } = require("console");
const express = require("express");

const path = require("path");

const router = express.Router();

const products = [];

//    /admin/add-product get

router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
  res.render("add-product", { pageTitle: "Add Product" });
});

//    /admin/add-product post
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.router = router;
exports.products = products;
