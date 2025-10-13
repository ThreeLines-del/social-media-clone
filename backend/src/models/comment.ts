import mongoose, { Model } from "mongoose";
import { IComment } from "../../types-schemas/types.js";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const CommentModel: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  commentSchema
);
export default CommentModel;
