const Product = require("../models/product");

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
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
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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
  req.user
    .getCart()
    .then((fetchedCart) => {
      if (!fetchedCart) {
        return req.user
          .createCart()
          .then((cart) => {
            return cart.getProducts();
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return fetchedCart.getProducts();
    })
    .then((cartItems) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartItems,
      });
    })

    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res) => {
  const productId = req.body.productId;
  let newQuantity = 1;
  let cart;
  req.user
    .getCart()
    .then((fetchedCart) => {
      if (!fetchedCart) {
        return req.user
          .createCart()
          .then((createdCart) => {
            cart = createdCart;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        cart = fetchedCart;
      }
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      console.log(products);
      if (products.length > 0) {
        product = products[0];
        newQuantity = product.cartItem.quantity + 1;
        return product; // Promise.resolve(product)
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return cart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postDeleteCartItem = (req, res) => {
  const productId = req.body.productId;
  console.log("productId :>> ", productId);
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCreateOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };

              return product;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        })
        .then((result) => {
          fetchedCart.setProducts(null);
          res.redirect("/orders");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log(orders[0].products[0]);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "orders Page",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetails = (req, res) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
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
