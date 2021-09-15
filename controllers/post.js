const Post = require("../models/posts");
const User = require("../models/user");
const { post } = require("../routes/home");
const Category = require("../models/categories");
const errorUtil = require("../util/errormessage").getErrorMessage;
exports.getpostController = (req, res, next) => {
  User.findById(req.session.user).then((user) => {
    res.render("createpost/write", {
      editing: false,
      message: errorUtil(req.flash("info")),
      realuser: user,
      pageTitle: "write a post 😉",
      prevInput: {
        image: "",
        category: "",
        title: "",
        postDesc: "",
      },
    });
  });
};

exports.postWrite = (req, res, next) => {
  User.findById(req.session.user)
    .then((user) => {
      const username = req.session.user.username;
      const category = req.body.category;
      const title = req.body.title;
      const postDesc = req.body.postdescription;
      const image = req.file;
      console.log(image);

      if (!image) {
        req.flash("info", "Upload an image please.");
        return res.status(422).render("createpost/write", {
          editing: false,
          message: errorUtil(req.flash("info")),
          realuser: user,
          pageTitle: "Write post 😉",
          prevInput: {
            image: image,
            category: category,
            title: title,
            postDesc: postDesc,
          },
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
      post
        .save()
        .then(() => {
          console.log("post created");
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getSinglepost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      res.render("singlepost/singlepost", {
        post: post,
        message: "",
        pageTitle: "single post",
      });
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.body.postId;

  Post.findOne({ userId: req.session.user._id })
    .then((post) => {
      if (!post) {
        req.flash("info", "You can only delete your post");
        Post.findById(postId)
          .then((post) => {
            res.status(422).render("singlepost/singlepost", {
              post: post,
              message: errorUtil(req.flash("info")),
              pageTitle: "Single post",
            });
          })
          .catch((err) => console.log(err));
      }

      post.deleteOne();
    })
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;
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
        message: null,
        pageTitle: "edit post",
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditPost = (req, res, next) => {
  const updatedcategory = req.body.category;
  const updatedTitle = req.body.title;
  const image = req.file;
  const postDesc = req.body.postdescription;
  const postId = req.body.postId;
  console.log(postId);
  Post.findOne({ userId: req.session.user._id })
    .then((post) => {
      if (!post) {
        req.flash("info", "you can only edit your post");
        return Post.findById(postId)
          .then((post) => {
            res.status(422).render("singlepost/singlepost", {
              post: post,
              message: req.flash("info"),
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
        return post.save();
      }
    })
    .then(() => res.redirect(`/`))
    .catch((err) => console.log(err));
};
