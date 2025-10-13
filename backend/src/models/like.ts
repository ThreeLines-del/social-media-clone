import mongoose, { Model } from "mongoose";
import { ILike } from "../../types-schemas/types.js";

const likeSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate likes on same post
likeSchema.index({ post: 1, user: 1 }, { unique: true });

const LikeModel: Model<ILike> = mongoose.model<ILike>("Like", likeSchema);
export default LikeModel;
