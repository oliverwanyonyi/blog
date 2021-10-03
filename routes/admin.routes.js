const adminController = require("../controllers/admin");
const express = require("express");
const router = express.Router();
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.postCategories);

module.exports = router;
