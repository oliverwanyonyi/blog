const express = require("express");

const router = express.Router();
const isAuth = require("../middleware/is-auth");
const postController = require("../controllers/post");
router.get("/createpost", isAuth, postController.getpostController);
router.post("/createpost", isAuth, postController.postWrite);
router.get("/post/:postId", isAuth, postController.getSinglepost);
router.post("/deletepost", isAuth, postController.deletePost);
router.get("/editpost/:postId", postController.getEditPost);
router.post("/editpost", postController.postEditPost);
module.exports = router;
