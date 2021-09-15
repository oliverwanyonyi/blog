const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/user");
const router = express.Router();
const signUpController = require("../controllers/auth");
router.get("/signup", signUpController.getSignUp);
router.get("/login", signUpController.getLogin);
router.post(
  "/signup",
  check("username", "enter a username atleast 7 characters")
    .isLength({ min: 6, max: 10 })
    .toLowerCase(),
  check("email")
    .isEmail()
    .withMessage("please enter a valid email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("User already exists use a different email");
        }
      });
    })
    .normalizeEmail(),
  body(
    "password",
    "We suggest a stronger password atleast 10 characters a combination of characters and numbers."
  )
    .isLength({ min: 8, max: 10 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("passwords have to match");
    } else {
      return true;
    }
  }),
  check(
    "bio",
    "bio should be atleast 30 characters & not more than 1000 characters."
  )
    .isLength({ min: 30, max: 1000 })
    .trim(),
  signUpController.postSignUp
);
router.post(
  "/login",
  check("email").isEmail().withMessage("Please enter a valid email"),
  body("password", "incorrect password please try again")
    .isLength({ min: 8, max: 16 })
    .isAlphanumeric()
    .trim(),
  signUpController.postSignIn
);
router.post("/logout", signUpController.postLogout);
module.exports = router;
