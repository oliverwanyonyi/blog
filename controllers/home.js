const Posts = require("../models/posts");
const User = require("../models/user");
exports.getHomePage = (req, res, next) => {
  User.find(req.session.user._id).then((users) => {
    Posts.find().then((posts) => {
      res.render("home/index", {
        posts: posts,
        users,
        user: req.user,
        pageTitle: "Welcome to blogger",
      });
    });
  });
};
