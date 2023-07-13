exports.isAuthenticated = (req, res, next) => {
  console.log(req.session.isLogedin);
  if (!req.session.isLogedin) {
    res.redirect("/login");
  }
  next();
};
