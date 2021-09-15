const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const errorUtil = require("../util/errormessage").getErrorMessage;
exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    message: errorUtil(req.flash("info")),
    validationErrors: [],
    updating: false,
    prevInput: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    pageTitle: "signup",
  });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    message: errorUtil(req.flash("info")),
    validationErrors: [],
    prevInput: {
      email: "",
      password: "",
    },
    user: req.user,
    pageTitle: "login",
  });
};

exports.postSignIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      validationErrors: errors.array(),
      message: errors.array()[0].msg,
      isAuthenticated: false,
      prevInput: {
        email: email,
        password: password,
      },
      pageTitle: "login",
    });
  }

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("info", "Invalid Email address");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((correctPassword) => {
        if (correctPassword) {
          req.session.userLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        return res.status(422).render("auth/login", {
          validationErrors: [],
          message: "invalid email or password",
          isAuthenticated: false,
          prevInput: {
            email: email,
            password: password,
          },
          pageTitle: "login",
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postSignUp = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const image = req.file;
  const bio = req.body.bio;
  if (!image) {
    req.flash("info", "Please choose an image");
    return res.redirect("/signup");
  }
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      isAuthenticated: false,
      message: errors.array()[0].msg,
      updating: false,
      prevInput: {
        image: image,
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        bio: bio,
      },
      pageTitle: "signup",
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        bio: bio,
        image: image.path,
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
