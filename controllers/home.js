const Posts = require("../models/posts");
const User = require("../models/user");
exports.getHomePage = (req, res, next) => {
  Posts.find().then((posts) => {
    res.render("home/index", {
      posts: posts,
      user: req.user,
      pageTitle: "Welcome to blogger",
    });
  });
};
