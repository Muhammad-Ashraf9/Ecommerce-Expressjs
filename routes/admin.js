const express = require("express");
const { body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");

const { isAuth } = require("../middleware/isAuth");

const router = express.Router();
const editAddProductValidation = () => [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("should be string and at least 5 characters."),
  body("imageUrl").isURL().withMessage("Not a valid URL"),
  body("price").isNumeric(),
  body("description").isLength({ min: 40, max: 400 }),
];

// //    /admin/add-product get

router.get("/add-product", isAuth, getAddProduct);

// //    /admin/add-product post
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .notEmpty()
      .withMessage("should be string and at least 5 characters."),
    body("imageUrl").isURL().withMessage("Not a valid URL"),
    body("price").isNumeric(),
    body("description").isLength({ min: 40, max: 400 }),
  ],
  isAuth,
  postAddProduct
);

// //    /admin/products get
router.get("/products", isAuth, getAdminProducts);

// //    /admin/edit-product get
router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  editAddProductValidation(),
  isAuth,
  postEditProduct
);

router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
