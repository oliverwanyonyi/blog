const mongoose = require("mongoose");
const Post = require("./posts");
const categoriesSchema = new mongoose.Schema({
  category: {
    type: Array,
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("Category", categoriesSchema);
