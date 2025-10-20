import DataLoader from "dataloader";
import PostModel from "./models/post.js";
import { IFollow, IPost } from "./types-schemas/types.js";
import FollowModel from "./models/follow.js";
import mongoose from "mongoose";
import LikeModel from "./models/like.js";
import CommentModel from "./models/comment.js";

function createLoaders() {
  return {
    postLoader: new DataLoader<string, IPost[]>(async (userIds) => {
      const posts = await PostModel.find({ author: { $in: userIds } });

      const postsByUserId: Record<string, IPost[]> = {};

      for (const post of posts) {
        const authorId = post.author.toString();
        if (!postsByUserId[authorId]) postsByUserId[authorId] = [];
        postsByUserId[authorId].push(post);
      }

      return userIds.map((id) => postsByUserId[id] || []);
    }),

    followersLoader: new DataLoader<string, IFollow[]>(async (userIds) => {
      const followers = await FollowModel.find({ following: { $in: userIds } });

      const followersByUserId: Record<string, IFollow[]> = {};

      for (const follower of followers) {
        const followerId = follower.toString();
        if (!followersByUserId[followerId]) followersByUserId[followerId] = [];
        followersByUserId[followerId].push(follower);
      }

      return userIds.map((id) => followersByUserId[id] || []);
    }),

    followingLoader: new DataLoader<string, IFollow[]>(async (userIds) => {
      const following = await FollowModel.find({ follower: { $in: userIds } });

      const followingByUserId: Record<string, IFollow[]> = {};

      for (const one of following) {
        const followingId = one.toString();
        if (!followingByUserId[followingId])
          followingByUserId[followingId] = [];
        followingByUserId[followingId].push(one);
      }

      return userIds.map((id) => followingByUserId[id] || []);
    }),

    followersCountLoader: new DataLoader<string, number>(async (userIds) => {
      const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

      const follows = await FollowModel.aggregate([
        { $match: { following: { $in: objectIds } } },
        { $group: { _id: "$following", count: { $sum: 1 } } },
      ]);

      const countMap: Record<string, number> = {};
      for (const doc of follows) {
        countMap[doc._id.toString()] = doc.count;
      }

      return userIds.map((id) => countMap[id] || 0);
    }),

    followingCountLoader: new DataLoader<string, number>(async (userIds) => {
      const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

      const follows = await FollowModel.aggregate([
        { $match: { follower: { $in: objectIds } } },
        { $group: { _id: "$follower", count: { $sum: 1 } } },
      ]);

      const countMap: Record<string, number> = {};
      for (const doc of follows) {
        countMap[doc._id.toString()] = doc.count;
      }

      return userIds.map((id) => countMap[id] || 0);
    }),

    postsCountLoader: new DataLoader<string, number>(async (userIds) => {
      const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

      const posts = await PostModel.aggregate([
        { $match: { author: { $in: objectIds } } },
        { $group: { _id: "$author", count: { $sum: 1 } } },
      ]);

      const countMap: Record<string, number> = {};
      for (const doc of posts) {
        countMap[doc._id.toString()] = doc.count;
      }

      return userIds.map((id) => countMap[id] || 0);
    }),

    likesCountLoader: new DataLoader<string, number>(async (userIds) => {
      const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

      const likes = await LikeModel.aggregate([
        { $match: { post: { $in: objectIds } } },
        { $group: { _id: "$post", count: { $sum: 1 } } },
      ]);

      const countMap: Record<string, number> = {};
      for (const doc of likes) {
        countMap[doc._id.toString()] = doc.count;
      }

      return userIds.map((id) => countMap[id] || 0);
    }),

    commentsCountLoader: new DataLoader<string, number>(async (userIds) => {
      const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

      const comments = await CommentModel.aggregate([
        { $match: { post: { $in: objectIds } } },
        { $group: { _id: "$post", count: { $sum: 1 } } },
      ]);

      const countMap: Record<string, number> = {};
      for (const doc of comments) {
        countMap[doc._id.toString()] = doc.count;
      }

      return userIds.map((id) => countMap[id] || 0);
    }),
  };
}

export default createLoaders;
