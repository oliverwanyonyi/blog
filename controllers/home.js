const Posts = require("../models/posts");
const User = require("../models/user");
exports.getHomePage = (req, res, next) => {
  Posts.find().then((posts) => {
    User.find()
      .then((users) => {
        res.render("home/index", {
          posts: posts,
          user: req.user,
          users,
          pageTitle: "Welcome to blogger",
        });
      })
      .catch((err) => console.log(err));
  });
};
