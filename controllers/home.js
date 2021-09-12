const Posts = require("../models/posts");
const User = require("../models/user");
exports.getHomePage = (req, res, next) => {
  Posts.find()
    .then((posts) => {
      User.findById(req.session.user).then((realuser) => {
        User.find()
          .then((users) => {
            res.render("home/index", {
              posts: posts,
              realuser,
              users,
              pageTitle: "Welcome to blogger",
            });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};
