import mongoose, { Model } from "mongoose";
import { IUser } from "../types-schemas/types.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default UserModel;
