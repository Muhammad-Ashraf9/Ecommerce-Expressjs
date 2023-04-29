const express = require("express");
const bodyparser = require("body-parser");

const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
// app.set("view", "views"); // default

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.router);
app.use(shopRoutes);

app.use((req, res) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000, () => {
  console.log("server on 3000");
});
