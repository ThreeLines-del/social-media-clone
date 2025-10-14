import { Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  name?: string;
  email: string;
  passwordHash: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  followersCount: number;
  followingCount: number;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId | IUser;
  content: string;
  image?: string;

  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  likesCount?: number;
  commentsCount?: number;
}

export interface IComment extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILike extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFollow extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphQLContext {
  currentUser?: IUser | null;
  models: {
    User: Model<IUser>;
    Post: Model<IPost>;
    Comment: Model<IComment>;
    Like: Model<ILike>;
    Follow?: Model<IFollow>;
  };
}
