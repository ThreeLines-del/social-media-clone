import mongoose, { Model } from "mongoose";
import { IFollow } from "../types-schemas/types.js";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate follow entries
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const FollowModel: Model<IFollow> = mongoose.model<IFollow>(
  "Follow",
  followSchema
);
export default FollowModel;
