const Category = require("../models/categories");

exports.getAddCategory = async (req, res, next) => {
  const categories = await Category.find();
  res.render("category/categories", {
    pageTitle: "add categories",
    categories,
    editing: false,
    category: [],
  });
};

exports.postCategories = (req, res, next) => {
  const cate = req.body.category;
  Category.findOne({ title: cate }).then((c) => {
    if (c) {
      req.flash("error", "category already exists");
      return res.redirect("/");
    }
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
  });
};

exports.getCategoriesIndex = async (req, res, next) => {
  const categories = await Category.find();
  res.render("category/categoriesindex", {
    pageTitle: "Categories",
    categories,
  });
};

exports.getEditCategory = async (req, res, next) => {
  const categories = await Category.find();
  const editMode = req.query.edit;
  const cateId = req.params.cateId;
  try {
    if (!editMode) {
      return next();
    }
    const category = await Category.findById(cateId);
    if (!category) {
      return res.redirect("/");
    }
    res.render("category/categories", {
      pageTitle: "edit category",
      category,
      categories,
      editing: editMode,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.postEditCategory = async (req, res, next) => {
  console.log("init");
  const { cateId, category } = req.body;
  console.log(cateId);
  const cate = await Category.findById(cateId);

  try {
    if (!cate) {
      req.flash("error", "no category found");
      return res.redirect("/admin/categories");
    }

    cate.title = category;

    await cate.save();
    req.flash("success", "category updated successfully");

    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const cateId = req.body.cateId;
  const category = await Category.findById(cateId);
  try {
    await category.deleteOne();
    req.flash("success", "category has been deleted");
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
