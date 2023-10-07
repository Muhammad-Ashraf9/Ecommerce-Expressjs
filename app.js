const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const { csrfSync } = require("csrf-sync");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const port = process.env.PORT || 3000;

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    // if (req.body["CSRFToken"]) return req.body["CSRFToken"];
    // return req.headers["x-csrf-token"];
    return req.body["CSRFToken"];
    // return req.body["CSRFToken"] || req.headers["x-csrf-token"];
  },
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const { get404, get500 } = require("./controllers/error");

const User = require("./models/user");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // default

app.use(bodyparser.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 36000000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions",
    }),
  })
);
app.use(csrfSynchronisedProtection);
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogedIn;
  res.locals.CSRFToken = req.csrfToken(true);
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch((err) => {
      next(err);
    });
});

app.use("/admin", adminRoutes);

app.use(authRoutes);

app.use(shopRoutes);

app.use(get404);

app.use(get500);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(port, () => {
        console.log("server on 3000");
      });
    // app.listen(port, () => {
    //   console.log("server on 3000");
    // });
  })
  .catch((err) => {
    next(err);
  });
