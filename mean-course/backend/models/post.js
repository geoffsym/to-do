import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, requred: true },
});

export default mongoose.model("Post", postSchema);
