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
    .isLength({ min: 5 })
    .withMessage("Title length should be  at least 5."),
  body("imageUrl").isURL().withMessage("Image URL not a valid URL"),
  body("price").isNumeric().withMessage("Price should be valid number"),
  body("description")
    .isLength({ min: 10, max: 100 })
    .withMessage("Description length should be between 10 and 100."),
];

// //    /admin/add-product get

router.get("/add-product", isAuth, getAddProduct);

// //    /admin/add-product post
router.post(
  "/add-product",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Title length should be  at least 5."),
    body("imageUrl").isURL().withMessage("Image URL not a valid URL"),
    body("price").isNumeric().withMessage("Price should be valid number"),
    body("description")
      .isLength({ min: 10, max: 100 })
      .withMessage("Description length should be between 10 and 100."),
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
