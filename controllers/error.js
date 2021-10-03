const Categories = require("../models/categories");
const User = require("../models/user");
exports.getErrorPage = async (req, res, next) => {
  const categories = await Categories.find();
  res
    .status(404)
    .render("error/error", { pageTitle: "404 page not found", categories });
};
