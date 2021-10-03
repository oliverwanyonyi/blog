const mongoose = require("mongoose");
const Post = require("./posts");
const categoriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    unique: true,
  },
});

module.exports = mongoose.model("Category", categoriesSchema);
