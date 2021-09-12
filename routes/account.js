const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const settingsController = require("../controllers/account");
const isAuth = require("../middleware/is-auth");
router.get("/user/:userId", isAuth, settingsController.getAccountPage);
router.post(
  "/updateAccount",
  check(
    "password",
    "we suggest a stronger password combination of characters and numbers"
  )
    .isAlphanumeric()
    .isLength({ min: 8, max: 10 }),
  check(
    "bio",
    "bio should be atleast 25 characters & not more than 100 characters."
  )
    .isLength({ min: 25, max: 300 })
    .trim(),
  isAuth,
  settingsController.postUpdateAccount
);
router.get("/deleteaccount", settingsController.getDeleteAccount);
router.post("/deleteaccount", settingsController.postDeleteAccount);

module.exports = router;
