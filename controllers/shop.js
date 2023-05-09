const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        pageTitle: "Main Page",
        products: rows,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/index", {
        pageTitle: "Main Page",
        products: products,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};
exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, product.price);
  });
  res.redirect("/cart");
};
exports.postDeleteCartItem = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(product.id, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", { path: "/orders", pageTitle: "orders Page" });
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(([[product]]) => {
      console.log(product);
      res.render("shop/product-details", {
        path: "/products",
        pageTitle: product.title,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
