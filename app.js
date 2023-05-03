const express = require("express");
const bodyparser = require("body-parser");

const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // default

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(3000, () => {
  console.log("server on 3000");
});
