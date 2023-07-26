const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult, matchedData } = require("express-validator");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

//get
exports.getsignup = (req, res, next) => {
  res.status(201).render("auth/signup", {
    pageTitle: "signup",
    path: "signup",
    message: req.flash("error"),
    oldData: { email: "", password: "", confirmPassword: "" },
  });
};

exports.getLogin = (req, res, next) => {
  res.status(201).render("auth/login", {
    pageTitle: "Login",
    path: "login",
    message: "",
    oldData: { email: "", password: "" },
  });
};
exports.getResetPassword = (req, res, next) => {
  res.status(201).render("auth/reset-password", {
    pageTitle: "Reset Password",
    path: "/reset-password",
    message: req.flash("error"),
  });
};

exports.getNewPassword = (req, res, next) => {
  const resetToken = req.params.resetToken;
  User.findOne({ resetToken: resetToken, resetExpiration: { $gt: new Date() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Try requesting another reset password email.");
        return res.redirect("/reset-password");
      }

      res.status(201).render("auth/new-password", {
        pageTitle: "Confirm Password",
        path: "/new-password",
        message: req.flash("error"),
        userId: user._id,
        resetToken: resetToken,
      });
    })
    .catch((err) => {
      next(err);
    });
};

//post
exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;
  const result = validationResult(req);
  if (result.isEmpty()) {
    bcrypt.hash(password, 12, async (err, hashedPassword) => {
      if (err) {
        next(err);
      }
      const newUser = new User({ email: email, password: hashedPassword });
      await newUser.save();
      res.redirect("/login");
      // return transporter.sendMail({
      //   from: process.env.SENDER_EMAIL,
      //   to: email,
      //   subject: "Welcome to our Shop",
      //   html: `<b>Welcome</b>`,
      // });
    });
  } else {
    console.log(" result.array() :>> ", result.array());
    res.status(403).render("auth/signup", {
      pageTitle: "signup",
      path: "signup",
      message: result.array()[0],
      oldData: req.body,
    });
  }
};

exports.postLogin = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    res.redirect("/");
  } else {
    res.status(403).render("auth/login", {
      pageTitle: "login",
      path: "login",
      message: result.array()[0],
      oldData: req.body,
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/login");
  });
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  let resetToken;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "There is no account with this E-mail.");
        return res.redirect("/reset-password");
      }
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          next(err);
          return res.redirect("/reset-password");
        }
        resetToken = buffer.toString("hex");
        user.resetToken = resetToken;
        user.resetExpiration = new Date(new Date().getTime() + 30 * 60 * 1000); //current time+30m
        user.save().then(() => {
          req.flash("error", "Check your emails to reset your password.");
          res.redirect("/login");
          return transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Reset Password",
            text: "Reset Password",
            html: `<b>to reset your password click this link</b>
                    <a href=http://localhost:3000/reset-password/${resetToken}>http://localhost:3000/reset-password/'${resetToken}<a/>`,
          });
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;

  User.findOne({
    _id: userId,
    resetToken: resetToken,
    resetExpiration: { $gt: new Date() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Try requesting another reset password email.");
        return res.redirect("/reset-password");
      }
      bcrypt.hash(password, 12, (err, newHashedPassword) => {
        user.password = newHashedPassword;
        user.resetExpiration = undefined;
        user.resetToken = undefined;
        return user.save();
      });
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      next(err);
    });
};

//vaildations

/**
 * signup
 */
exports.checkEmailNotInUse = async (email) => {
  const user = await User.findOne({ email: email });
  console.log(user);
  if (user) {
    throw new Error("An account already exists with this E-mail.");
  }
};

exports.checkConfirmPasswordMatch = (confirmPassword, { req }) => {
  return confirmPassword === req.body.password;
};

/**
 * login
 */
exports.checkEmailNotFound = async (email, { req }) => {
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) {
    throw new Error("No account with this E-mail.");
  } else {
    req.user = user;
  }
};
exports.checkPasswordWrong = async (password, { req }) => {
  console.log("req.user>>>>>", req.user);
  const doMatch = await bcrypt.compare(password, req.user.password);
  if (!doMatch) {
    throw new Error("Wrong password.");
  } else {
    req.session.user = req.user;
    req.session.isLogedIn = true;
    req.session.save();
  }
};
