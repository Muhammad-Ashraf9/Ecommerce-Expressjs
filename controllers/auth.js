const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "login",
    message: req.flash("error"),
  });
};
exports.getResetPassword = (req, res) => {
  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    path: "/reset-password",
    message: req.flash("error"),
  });
};
exports.getsignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "signup",
    message: req.flash("error"),
  });
};
exports.getNewPassword = (req, res) => {
  const resetToken = req.params.resetToken;
  User.findOne({ resetToken: resetToken, resetExpiration: { $gt: new Date() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Try requesting another reset password email.");
        return res.redirect("/reset-password");
      }

      res.render("auth/new-password", {
        pageTitle: "Confirm Password",
        path: "/new-password",
        message: req.flash("error"),
        userId: user._id,
        resetToken: resetToken,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postResetPassword = (req, res) => {
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
          console.log(err);
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
      console.log(err);
    });
};
exports.postNewPassword = (req, res) => {
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
      console.log(err);
    });
};
exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "There is no account with this email.");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password, (err, doMatch) => {
        if (err) {
          console.log(err);
        }
        if (doMatch) {
          req.session.user = user;
          req.session.isLogedIn = true;
          req.session.save(() => {
            return res.redirect("/");
          });
        } else {
          req.flash("error", "Wrong password.");
          res.redirect("/login");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "There is an account with this email.");
        return res.redirect("/signup");
      }
      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) {
          console.log(err);
        }
        const newUser = new User({ email: email, password: hashedPassword });
        return newUser.save().then(() => {
          res.redirect("/login");
          return transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to our Shop",
            html: `<b>Welcome</b>`,
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
};
