module.exports = (req, res, next) => {
  if (!req.session.userLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
