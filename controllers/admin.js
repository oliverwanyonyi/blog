const Category = require("../models/categories");

exports.getCategories = (req, res, next) => {
  res.render("add-category/categories", { pageTitle: "add categories" });
};

exports.postCategories = (req, res, next) => {
  const cate = req.body.category;
  Category.findOne({ title: cate }).then((c) => {
    if (c) {
      req.flash("error", "category already exists");
      return res.redirect("/categories");
    }
    const newCate = new Category({
      title: cate,
    });
  });
  const newCate = new Category({
    title: cate,
  });
  newCate
    .save()
    .then(() => {
      req.flash("success", "category added");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
