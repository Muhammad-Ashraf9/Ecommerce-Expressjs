const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
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

  const product = new Product(null, title, description, price, imageUrl);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAdminProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products",
      path: "/admin/products",
      products: products,
    });
  });
};
exports.getEditProduct = (req, res) => {
  const isEditProduct = req.query.edit;
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editProduct: isEditProduct,
      product: product,
    });
  });
};
exports.postEditProduct = (req, res) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price = Number(req.body.price);
  const updatedProduct = new Product(
    productId,
    title,
    description,
    imageUrl,
    price
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};
exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};
