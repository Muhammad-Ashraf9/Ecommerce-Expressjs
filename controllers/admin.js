const Product = require("../models/product");
const { validationResult } = require("express-validator");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editProduct: false,
    errors: [],
  });
};

exports.getAdminProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId")
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
  const productId = req.params.productId;

  if (!isEditProduct) {
    res.redirect("/");
  }
  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editProduct: isEditProduct,
        product: product,
        errors: result.array(),
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postAddProduct = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { title, description, imageUrl } = req.body;
    const price = Number(req.body.price);
    const userId = req.user._id;
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
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
  } else {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editProduct: false,
      errors: result.array(),
      product: req.body,
    });
  }
};
exports.postEditProduct = (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { productId, title, description, imageUrl } = req.body;

    const price = Number(req.body.price);
    Product.findOneAndUpdate(
      { _id: productId, userId: req.session.user._id },
      {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      },

      { new: true }
    )
      .then(() => {
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editProduct: isEditProduct,
      product: req.body,
      errors: result.array(),
    });
  }
};
exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.findOneAndDelete({ _id: productId, userId: req.session.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
