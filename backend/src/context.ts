import DataLoader from "dataloader";
import PostModel from "./models/post.js";
import { IFollow, IPost, IUser } from "./types-schemas/types.js";
import FollowModel from "./models/follow.js";
import mongoose from "mongoose";
import LikeModel from "./models/like.js";
import CommentModel from "./models/comment.js";
import UserModel from "./models/user.js";

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

    // Users who follow a given user
    followersLoader: new DataLoader<string, IUser[]>(async (userIds) => {
      const follows = await FollowModel.find({
        following: {
          $in: userIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      });

      // Map followingId => array of followerIds
      const followerIdsByUserId: Record<string, string[]> = {};
      for (const follow of follows) {
        const followingId = follow.following.toString();
        const followerId = follow.follower.toString();
        if (!followerIdsByUserId[followingId])
          followerIdsByUserId[followingId] = [];
        followerIdsByUserId[followingId].push(followerId);
      }

      // Fetch all users who are followers
      const allFollowerIds = follows.map((f) => f.follower.toString());
      const users = await UserModel.find({ _id: { $in: allFollowerIds } });

      // Build lookup table for follower users
      const usersById = Object.fromEntries(
        users.map((u) => [u._id.toString(), u])
      );

      // Return arrays of follower User documents per user
      return userIds.map((id) => {
        const ids = followerIdsByUserId[id] || [];
        return ids.map((fid) => usersById[fid]).filter(Boolean);
      });
    }),

    // Users that a given user is following
    followingLoader: new DataLoader<string, IUser[]>(async (userIds) => {
      const follows = await FollowModel.find({
        follower: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
      });

      // Map followerId => array of followingIds
      const followingIdsByUserId: Record<string, string[]> = {};
      for (const follow of follows) {
        const followerId = follow.follower.toString();
        const followingId = follow.following.toString();
        if (!followingIdsByUserId[followerId])
          followingIdsByUserId[followerId] = [];
        followingIdsByUserId[followerId].push(followingId);
      }

      // Fetch all users being followed
      const allFollowingIds = follows.map((f) => f.following.toString());
      const users = await UserModel.find({ _id: { $in: allFollowingIds } });

      const usersById = Object.fromEntries(
        users.map((u) => [u._id.toString(), u])
      );

      // Return arrays of following User documents per user
      return userIds.map((id) => {
        const ids = followingIdsByUserId[id] || [];
        return ids.map((fid) => usersById[fid]).filter(Boolean);
      });
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
