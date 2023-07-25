const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const { csrfSync } = require("csrf-sync");
const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    return req.body["CSRFToken"];
  },
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404 } = require("./controllers/error");
const User = require("./models/user");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // default

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 36000000 },
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_URL,
      collectionName: "sessions",
    }),
  })
);
app.use(csrfSynchronisedProtection);
app.use(flash());

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(3000, () => {
      console.log("server on 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogedIn;
  res.locals.CSRFToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(get404);
app.use(get404);
