const { where } = require("sequelize");
const Product = require("../models/product");
const User = require("../models/user");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editProduct: false,
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price = Number(req.body.price);

  req.user
    .createProduct({
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAdminProducts = (req, res) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getEditProduct = (req, res) => {
  const isEditProduct = req.query.edit;
  if (!isEditProduct) {
    res.redirect("/");
  }
  const productId = req.params.productId;
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editProduct: isEditProduct,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postEditProduct = (req, res) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price = Number(req.body.price);
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.imageUrl = imageUrl;
      product.price = price;
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("Destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
