const express = require("express");
const { body } = require("express-validator");
const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

const { isAuth } = require("../middleware/isAuth");

const router = express.Router();
const editAddProductValidation = () => [
  body("title")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title length should be  at least 5."),
  body("price").isNumeric().withMessage("Price should be valid number"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Description length should be between 10 and 100."),
];

// //    /admin/add-product get

router.get("/add-product", isAuth, getAddProduct);

// //    /admin/add-product post
router.post("/add-product", editAddProductValidation(), isAuth, postAddProduct);

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
// need to change to delete instead of get
router.get("/product/:productId", isAuth, deleteProduct);

module.exports = router;
