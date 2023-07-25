const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");

const {
  postLogin,
  getLogin,
  postLogout,
  postSignup,
  getsignup,
  getResetPassword,
  postResetPassword,
  postNewPassword,
  getNewPassword,
  checkEmailNotInUse,
  checkConfirmPasswordMatch,
  checkEmailNotFound,
  checkPasswordWrong,
} = require("../controllers/auth");

const baseEmailChain = () =>
  body("email").trim().isEmail().withMessage("Wrong E-mail.");
const basePasswordChain = () =>
  body("password")
    .isLength({ min: 6 })
    .withMessage(`Password should be more than 6.`);

const router = express.Router();

router.get("/login", getLogin);
router.post(
  "/login",
  [
    baseEmailChain().custom(checkEmailNotFound),
    basePasswordChain()
      .custom(checkPasswordWrong)
      .withMessage("Wrong password."),
  ],
  postLogin
);

router.get("/signup", getsignup);
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Wrong E-mail.")
      .custom(checkEmailNotInUse),
    body("password")
      .isLength({ min: 6 })
      .withMessage(`Password should be more than 6.`),
    body("confirmPassword")
      .custom(checkConfirmPasswordMatch)
      .withMessage("Password doesn't match."),
  ],
  postSignup
);

router.get("/reset-password", getResetPassword);
router.post("/reset-password", postResetPassword);

router.get("/reset-password/:resetToken", getNewPassword);
router.post("/new-password", postNewPassword);

router.post("/logout", postLogout);

module.exports = router;
