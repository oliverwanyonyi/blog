const Categories = require("../models/categories");
const Posts = require("../models/posts");
const User = require("../models/user");
exports.getHomePage = (req, res, next) => {
  Categories.find().then((categories) => {
    Posts.find().then((posts) => {
      res.render("home/index", {
        posts: posts,
        categories,
        user: req.user,
        pageTitle: "Welcome to blogger",
      });
    });
  });
};
