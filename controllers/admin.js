const fs = require("fs");

const Product = require("../models/product");
const { validationResult, matchedData } = require("express-validator");
const { deleteFile } = require("../util/deleteFile");
exports.getAddProduct = (req, res, next) => {
  res.status(201).render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editProduct: false,
    errors: [],
    product: "",
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.status(201).render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        products: products,
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getEditProduct = (req, res, next) => {
  const isEditProduct = req.query.edit;
  const productId = req.params.productId;

  if (!isEditProduct) {
    res.redirect("/");
  }
  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      res.status(201).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editProduct: isEditProduct,
        product: product,
        errors: [],
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postAddProduct = (req, res, next) => {
  const result = validationResult(req);
  const data = matchedData(req, { onlyValidData: false });
  const image = req.file;

  if (!result.isEmpty() || !image) {
    if (image) {
      deleteFile(image.path);
    }
    return res.status(403).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editProduct: false,
      errors: image ? result.array() : [{ msg: "please insert an image" }], //image validation msg to match with validator array
      product: data,
    });
  }
  const { title, description } = req.body;
  const price = Number(req.body.price);
  const userId = req.user._id;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: image.path,
    userId: userId,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      next(err);
    });
};
exports.postEditProduct = (req, res, next) => {
  const result = validationResult(req);
  const data = matchedData(req, { onlyValidData: false });
  if (!result.isEmpty()) {
    return res.status(403).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editProduct: true,
      product: data,
      errors: result.array(),
    });
  }
  const { productId, title, description } = req.body;
  const price = Number(req.body.price);
  const imageUrl = req.file?.path;

  Product.findOne({ _id: productId, userId: req.session.user._id })
    .then((product) => {
      if (imageUrl && product.imageUrl !== imageUrl) {
        deleteFile(product.imageUrl);
        product.imageUrl = imageUrl;
      }
      product.title = title;
      product.description = description;
      product.price = price;
      product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  console.log(productId);
  Product.findOneAndDelete({ _id: productId, userId: req.session.user._id })
    .then((product) => {
      deleteFile(product.imageUrl);
      res.json({ message: "success" });
    })
    .catch((err) => {
      res.json({ message: "fail" });
    });
};
