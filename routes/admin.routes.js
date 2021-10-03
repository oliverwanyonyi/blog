const adminController = require("../controllers/admin");
const express = require("express");
const router = express.Router();
router.get("/admin/add-category", adminController.getAddCategory);
router.post("/admin/add-category", adminController.postCategories);

router.get("/admin/categories", adminController.getCategoriesIndex);
router.get("/admin/edit-category/:cateId", adminController.getEditCategory);
router.post("/admin/edit-category", adminController.postEditCategory);
router.post("/admin/delete-category", adminController.deleteCategory);

module.exports = router;
