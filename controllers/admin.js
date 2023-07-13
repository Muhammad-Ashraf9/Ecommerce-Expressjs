const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editProduct: false,
    isAuthenticated: req.session.isLogedin,
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
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
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAdminProducts = (req, res) => {
  console.log(req.session.logedin);

  Product.find({})
    // .select("title price -_id")
    // .populate("userId")
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        products: products,
        isAuthenticated: req.session.isLogedin,
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
  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editProduct: isEditProduct,
        product: product,
        isAuthenticated: req.session.isLogedin,
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
  // Product.findById(productId).then((product) => {
  //   product.title = title;
  //   product.description = description;
  //   product.imageUrl = imageUrl;
  //   product.price = price;
  //   return product.save();
  // });
  // then(() => {
  //   res.redirect("/admin/products");
  // }).catch((err) => {
  //   console.log(err);
  // });
  Product.findOneAndUpdate(
    { _id: productId },
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
};
exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  console.log(productId);
  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
