const User = require("../models/user");
exports.getErrorPage = (req, res, next) => {
  res.status(404).render("error/error", { pageTitle: "404 page not found" });
};
