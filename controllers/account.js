const User = require("../models/user");
const bcrypt = require("bcrypt");
const Post = require("../models/posts");
const errorUtil = require("../util/errormessage").getErrorMessage;
const { validationResult } = require("express-validator");
const Categories = require("../models/categories");

exports.getAccountPage = async (req, res, next) => {
  const updateMode = req.query.updateaccount;
  if (!updateMode) {
    return res.redirect("/");
  }
  const categories = await Categories.find();
  res.render("auth/signup", {
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
    categories,
  });
};

exports.postUpdateAccount = async (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;
  const image = req.file;
  const bio = req.body.bio;
  const userId = req.params.userId;
  const categories = await Categories.find();
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        updating: true,
        validationErrors: errors.array(),
        errorMessage: errors.array()[0].msg,
        user: req.user,
        prevInput: {
          username: userName,
          password: password,
          bio: bio,
        },
        pageTitle: "update account",
        categories,
      });
    }
    const user = await User.findById(req.user);
    const hashedPassword = await bcrypt.hash(password, 10);
    user._id = req.session.user._id;
    user.password = hashedPassword;
    user.bio = bio;
    if (!image) {
      req.flash("error", "Upload an image please.");
      return res.redirect(`/user/${userId}?updateaccount=true`);
    }
    if (image) {
      user.image = image.path;
    }
    req.flash("success", "account updated successfully");
    await user.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

//   return bcrypt
//     .hash(password, 10)
//     .then((hashedPassword) => {
//       req.user._id = req.session.user._id;
//       req.user.password = hashedPassword;
//       req.user.bio = bio;
//       if (!image) {
//         req.flash("error", "Upload an image please.");
//         return res.redirect(`/user/${userId}?updateaccount=true`);
//       }

//       req.flash("success", "account updated successfully");
//       return req.user.save();
//     })
//     .then(() => {
//       console.log("account updated");
//       res.redirect("/");
//     })
//     .catch((err) => console.log(err));
// };

exports.getDeleteAccount = (req, res, next) => {
  res.render("account/deleteaccount", {
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
        req.flash("error", "Email does not exists");
        res.redirect("/deleteaccount");
      }

      bcrypt
        .compare(password, user.password)
        .then((correctpassword) => {
          if (correctpassword) {
            Post.findOne({ userId: req.user._id }).then((post) =>
              post.remove()
            );

            user.deleteOne();
            return req.session.destroy((err) => {
              console.log(err);
              res.status(302).render("auth/login", {
                successMessage: "you logged out successfully",
                pageTitle: "login",
                isAuthenticated: false,
                validationErrors: [],
                prevInput: {
                  email: "",
                  password: "",
                },
              });
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
