const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const homeController = require("../controllers/home");
router.get("/", isAuth, homeController.getHomePage);

module.exports = router;
