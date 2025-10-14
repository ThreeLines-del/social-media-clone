import mongoose, { Model } from "mongoose";
import { IPost } from "../types-schemas/types.js";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, trim: true },
    image: { type: String },
  },
  { timestamps: true }
);

// Virtuals for counts
postSchema.virtual("likesCount", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
  count: true,
});

postSchema.virtual("commentsCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const PostModel: Model<IPost> = mongoose.model<IPost>("Post", postSchema);
export default PostModel;
