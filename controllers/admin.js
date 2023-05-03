const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const price =Number( req.body.price);

  const product = new Product(title, description, price, imageUrl);
  product.save();
  res.redirect("/");
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
  Product.fetchAll((products) => {
    res.render("admin/edit-product", {
      pageTitle: "Admin Edit Products",
      path: "/admin/edit-product",
      products: products,
    });
  });
};
