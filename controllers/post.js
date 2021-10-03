const Post = require("../models/posts");
const User = require("../models/user");
const Category = require("../models/categories");
const { postCategories } = require("./admin");
exports.getpostController = (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.render("createpost/write", {
        editing: false,
        user: req.user,
        pageTitle: "write a post ✍🏻",
        prevInput: {
          image: "",
          category: "",
          title: "",
          postDesc: "",
        },
        categories: categories,
      });
    })
    .catch((err) => console.log(err));
};

exports.postWrite = async (req, res, next) => {
  const username = req.user.username;
  const category = req.body.category;
  const title = req.body.title;
  const postDesc = req.body.postdescription;
  const image = req.file;
  const categories = await Category.find();
  try {
    if (!image) {
      // req.flash("error", ".");
      return res.status(422).render("createpost/write", {
        editing: false,
        user: req.user,
        errorMessage: "Upload an image please",
        pageTitle: "Write post 😉",
        prevInput: {
          image: image,
          category: category,
          title: title,
          postDesc: postDesc,
        },
        categories,
      });
    }

    const imageUrl = image.path;
    const post = new Post({
      username: username,
      category: category,
      title: title,
      image: imageUrl,
      postdescription: postDesc,
      userId: req.session.user._id,
    });

    await post.save();
    req.flash("success", "post was created successfully");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getSinglepost = async (req, res, next) => {
  const postId = req.params.postId;
  const categories = await Category.find();
  Post.findById(postId)
    .then((post) => {
      res.render("singlepost/singlepost", {
        post: post,
        pageTitle: "single post",
        categories,
      });
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.body.postId;

  Post.findOne({ userId: req.user })
    .then((post) => {
      if (!post) {
        req.flash("error", "You can only delete your post");

        return res.redirect("/");
      }
      req.flash("success", "post was deleted successfully");
      return post.deleteOne();
    })
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPost = async (req, res, next) => {
  const editMode = req.query.edit;
  const categories = await Category.find();

  if (!editMode) {
    return res.redirect("/");
  }
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("createpost/write", {
        post: post,
        editing: editMode,
        pageTitle: "edit post",
        user: req.user,
        categories,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditPost = async (req, res, next) => {
  const updatedcategory = req.body.category;
  const updatedTitle = req.body.title;
  const image = req.file;
  const postDesc = req.body.postdescription;
  const postId = req.body.postId;
  const categories = await Category.find();
  console.log(postId);
  Post.findOne({ userId: req.user })
    .then((post) => {
      if (!post) {
        return Post.findById(postId)
          .then((post) => {
            res.status(422).render("singlepost/singlepost", {
              post: post,
              user: req.user,
              pageTitle: "edit post",
              categories,
              errorMessage: "you can only edit your post",
            });
          })
          .catch((err) => console.log(err));
      } else {
        post.category = updatedcategory;
        if (image) {
          post.image = image.path;
        }
        post.title = updatedTitle;
        post.postdescription = postDesc;
        req.flash("success", "post updated successfully");
        return post.save();
      }
    })
    .then(() => res.redirect(`/`))
    .catch((err) => console.log(err));
};
