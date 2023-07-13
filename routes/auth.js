const express = require("express");

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
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/signup", getsignup);
router.post("/signup", postSignup);

router.get("/reset-password", getResetPassword);
router.post("/reset-password", postResetPassword);

router.get("/reset-password/:resetToken", getNewPassword);
router.post("/new-password", postNewPassword);

router.post("/logout", postLogout);

module.exports = router;
