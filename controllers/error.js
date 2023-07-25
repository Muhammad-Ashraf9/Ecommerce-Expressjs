exports.get404 = (req, res) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", { pageTitle: "Page Not Found" });
};
exports.get500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).render("500", { pageTitle: "Server Issue", error: err });
};
