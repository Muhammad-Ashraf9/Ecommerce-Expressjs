const Product = require("../models/product");
const { validationResult, matchedData } = require("express-validator");
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
    res.status(403).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editProduct: false,
      errors: result.array(),
      product: data,
    });
  }
};
exports.postEditProduct = (req, res, next) => {
  const result = validationResult(req);
  const data = matchedData(req, { onlyValidData: false });
  console.log("matchedData :>> ", matchedData);
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
        next(err);
      });
  } else {
    res.status(403).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editProduct: true,
      product: data,
      errors: result.array(),
    });
  }
};
exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findOneAndDelete({ _id: productId, userId: req.session.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      next(err);
    });
};
