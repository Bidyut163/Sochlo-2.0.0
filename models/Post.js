const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: String,
  image: String,
  category: String,
  body: String,
  created: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
module.exports = mongoose.model("posts", postSchema);
