const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema({
  category: {
    type: Array,
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("Post", categoriesSchema);
