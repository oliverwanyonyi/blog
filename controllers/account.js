const User = require("../models/user");
const bcrypt = require("bcrypt");
const Post = require("../models/posts");
const errorUtil = require("../util/errormessage").getErrorMessage;
const { validationResult } = require("express-validator");

exports.getAccountPage = (req, res, next) => {
  const updateMode = req.query.updateaccount;
  if (!updateMode) {
    return res.redirect("/");
  }

  res.render("auth/signup", {
    message: errorUtil(req.flash("info")),
    user: req.user,
    updating: updateMode,
    validationErrors: [],
    prevInput: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    pageTitle: "updateaccount",
  });
};

exports.postUpdateAccount = (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;
  const image = req.file;
  const bio = req.body.bio;
  const userId = req.params.userId;
  console.log(bio);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      updating: true,
      validationErrors: errors.array(),
      message: errors.array()[0].msg,
      user: req.user,
      prevInput: {
        username: userName,
        password: password,
        bio: bio,
      },
      pageTitle: "update account",
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      req.user._id = req.session.user._id;
      req.user.username = userName;
      req.user.password = hashedPassword;
      req.user.bio = bio;
      if (!image) {
        req.flash("info", "Upload an image please.");
        return res.redirect(`/user/${userId}?updateaccount=true`);
      }
      if (image) {
        req.user.image = image.path;
      }
      req.flash("info", "account updated successfully");
      return req.user.save();
    })
    .then(() => {
      console.log("account updated");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getDeleteAccount = (req, res, next) => {
  res.render("account/deleteaccount", {
    message: errorUtil(req.flash("info")),
    user: req.user,
    pageTitle: "delete account 😥",
  });
};

exports.postDeleteAccount = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (!user) {
        console.log("Email does not exist");
        req.flash("info", "Email does not exists");
        res.redirect("/deleteaccount");
      }

      bcrypt
        .compare(password, user.password)
        .then((correctpassword) => {
          if (correctpassword) {
            req.flash("success", "user deleted successfullyy");

            Post.findOne({ userId: req.session.user._id }).then((post) =>
              post.remove()
            );
            user.deleteOne();
            return req.session.destroy((err) => {
              console.log(err);
              res.redirect("/signup");
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
