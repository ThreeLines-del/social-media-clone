import { GraphQLError } from "graphql";
import { GraphQLContext, IPost, IUser } from "../types-schemas/types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CommentSchema,
  PostSchema,
  UpdateProfileSchema,
  UserLoginSchema,
  UserRegisterSchema,
} from "../types-schemas/zod-schemas.js";
import { Types } from "mongoose";
import { paginate } from "../utils/paginate.js";
import { decodeCursor, encodeCursor } from "../utils/cursorEncodeDecode.js";
import { paginateFromArray } from "../utils/paginateFromArray.js";

const resolvers = {
  // Users
  Query: {
    me: (_: any, args: any, { currentUser }: GraphQLContext): IUser => {
      if (!currentUser) throw new GraphQLError("not authorized");
      return currentUser;
    },

    user: async (
      _: any,
      { username },
      { models }: GraphQLContext
    ): Promise<IUser> => {
      const user = await models.User.findOne({ username });
      return user;
    },

    users: async (
      _: any,
      { first, after },
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not unthorized");
      }

      const query = {};
      return paginate<IUser>(query, first, after, models.User);
    },

    // Posts
    post: async (
      _: any,
      { id },
      { currentUser, models }: GraphQLContext
    ): Promise<IPost> => {
      if (!currentUser) {
        throw new GraphQLError("Not unthorized");
      }

      const post = await models.Post.findById(id);
      return post;
    },

    posts: async (_: any, { first, after }, { models }: GraphQLContext) => {
      const query = {};
      return paginate<IPost>(query, first, after, models.Post);
    },

    feed: async (
      _: any,
      { first, after },
      { models, currentUser }: GraphQLContext
    ) => {
      if (!currentUser) throw new GraphQLError("Not authorized");

      const follows = await models.Follow.find({
        follower: currentUser.id,
      }).select("following");
      const followingIds = follows.map((f) => f.following);

      // Include the current user's own posts
      followingIds.push(currentUser.id);

      let query: any = { author: { $in: followingIds } };
      if (after) {
        const decoded = decodeCursor(after);
        if (Types.ObjectId.isValid(decoded)) {
          query._id = { $lt: new Types.ObjectId(decoded) };
        }
      }

      // Query posts from followed users
      const posts = await models.Post.find(query)
        .sort({ _id: -1 }) // newest first
        .limit(first + 1)
        .populate("author");

      const hasNextPage = posts.length > first;
      const edges = posts.slice(0, first).map((post) => ({
        node: post,
        cursor: encodeCursor(post._id.toString()),
      }));

      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;
      const totalCount = await models.Post.countDocuments({
        author: { $in: followingIds },
      });

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
        totalCount,
      };
    },

    // Comments
    comments: async (
      _: any,
      { postId, first, after },
      { models }: GraphQLContext
    ) => {
      const post = await models.Post.findById(postId);
      if (!post) {
        throw new GraphQLError("Post not found");
      }

      let query: any = { post: post._id };
      if (after) {
        const decoded = decodeCursor(after);
        if (Types.ObjectId.isValid(decoded)) {
          query._id = { $gt: new Types.ObjectId(decoded) };
        }
      }

      const comments = await models.Comment.find(query)
        .sort({ _id: 1 })
        .limit(first + 1)
        .populate("author");

      const hasNextPage = comments.length > first;
      const edges = comments.slice(0, first).map((comment) => ({
        node: comment,
        cursor: encodeCursor(comment._id.toString()),
      }));

      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;
      const totalCount = await models.Comment.countDocuments({
        post: post._id,
      });

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
        totalCount,
      };
    },
  },

  User: {
    posts: async (root: any, { first, after }, { loaders }: GraphQLContext) => {
      const userId = root.id;
      const allPosts = await loaders.postLoader.load(userId);
      return paginateFromArray<IPost>(allPosts, first, after);
    },

    followers: async (
      root: any,
      { first, after },
      { currentUser, loaders }: GraphQLContext
    ) => {
      if (!currentUser) throw new GraphQLError("Not authorized");

      const userId = root.id;
      const followers = await loaders.followersLoader.load(userId);

      return paginateFromArray<IUser>(followers, first, after);
    },

    followersCount: async (
      root: any,
      args: any,
      { loaders }: GraphQLContext
    ) => {
      const userId = root.id;
      return loaders.followersCountLoader.load(userId);
    },

    following: async (
      root: any,
      { first, after },
      { currentUser, loaders }: GraphQLContext
    ) => {
      if (!currentUser) throw new GraphQLError("Not authorized");

      const userId = root.id;
      const following = await loaders.followingLoader.load(userId);

      return paginateFromArray<IUser>(following, first, after);
    },

    followingCount: async (
      root: any,
      args: any,
      { loaders }: GraphQLContext
    ) => {
      const userId = root.id;
      return loaders.followingCountLoader.load(userId);
    },

    postsCount: async (root: any, args: any, { loaders }: GraphQLContext) => {
      const userId = root.id;
      return loaders.postsCountLoader.load(userId);
    },
  },

  Post: {
    likesCount: async (root: any, args: any, { loaders }: GraphQLContext) => {
      const postId = root.id;
      return loaders.likesCountLoader.load(postId);
    },

    commentsCount: async (
      root: any,
      args: any,
      { loaders }: GraphQLContext
    ) => {
      const postId = root.id;
      return loaders.commentsCountLoader.load(postId);
    },
  },

  Mutation: {
    // Auth
    register: async (
      _: any,
      args: any,
      { models }: GraphQLContext
    ): Promise<{ token: string; user: IUser }> => {
      const { username, email, password } = UserRegisterSchema.parse(args);

      try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new models.User({
          username,
          email,
          passwordHash,
        });

        const savedUser = await newUser.save();
        if (!savedUser) {
          throw new GraphQLError("couldn't create user", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        const userForToken = {
          id: savedUser._id,
          username: savedUser.username,
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET);

        return {
          token: token,
          user: savedUser,
        };
      } catch (err) {
        throw err;
      }
    },

    login: async (
      _: any,
      args: any,
      { models }: GraphQLContext
    ): Promise<{ token: string; user: IUser }> => {
      const { email, password } = UserLoginSchema.parse(args);

      try {
        const user = await models.User.findOne({ email });

        if (!user) {
          throw new GraphQLError("user not found", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        const passwordCorrect = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordCorrect) {
          throw new GraphQLError("invalid username or password", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        const userForToken = {
          username: user.username,
          id: user._id,
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET);

        return {
          token: token,
          user: user,
        };
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    // Posts
    createPost: async (
      _: any,
      args: any,
      { currentUser, models }: GraphQLContext
    ): Promise<IPost> => {
      if (!currentUser) {
        throw new GraphQLError("Not unthorized");
      }

      const { content, image } = PostSchema.parse(args);

      try {
        const newPost = new models.Post({
          author: currentUser._id,
          content: content,
          image: image,
        });
        const savedPost = newPost.save();

        return savedPost;
      } catch (error) {
        throw new GraphQLError(error);
      }
    },

    deletePost: async (
      _: any,
      { id },
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not authorized");
      }

      const post = await models.Post.findById(id);
      if (!post) {
        throw new GraphQLError("Post not found");
      }

      if (post.author.toString() !== currentUser.id.toString()) {
        throw new GraphQLError("You can only delete your own posts");
      }

      await models.Post.findByIdAndDelete(id);

      await Promise.all([
        models.Like.deleteMany({ post: id }),
        models.Comment.deleteMany({ post: id }),
      ]);

      return {
        success: true,
        message: "Post deleted successfully",
      };
    },

    // Comments
    addComment: async (
      _: any,
      args: any,
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not authorized");
      }

      const { postId, content } = CommentSchema.parse(args);

      const post = await models.Post.findById(postId);
      if (!post) {
        throw new GraphQLError("Post not found");
      }

      const newComment = new models.Comment({
        post: post._id,
        author: currentUser.id,
        content: content,
      });

      const savedComment = (await newComment.save()).populate("author");
      return savedComment;
    },

    deleteComment: async (
      _: any,
      { id }: any,
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not authorized");
      }

      const comment = await models.Comment.findById(id);
      if (!comment) {
        throw new GraphQLError("Comment not found");
      }

      if (comment.author._id.toString() !== currentUser.id.toString()) {
        throw new GraphQLError("You can only delete your own comments");
      }

      await models.Comment.findByIdAndDelete(id);

      return {
        success: true,
        message: "Comment deleted successfully",
      };
    },

    // Likes
    likePost: async (
      _: any,
      { postId },
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not authorized");
      }

      const post = await models.Post.findById(postId);
      if (!post) {
        throw new GraphQLError("Post not found");
      }

      const existingLike = await models.Like.findOne({
        post: post._id,
        user: currentUser.id,
      });

      if (existingLike) {
        await existingLike.deleteOne();
        return { liked: false };
      }

      const newLike = new models.Like({
        post: post._id,
        user: currentUser.id,
      });

      await newLike.save();
      return { liked: true };
    },

    // Follows
    followUser: async (
      root: any,
      { userId },
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not authorized");
      }

      if (userId === currentUser.id) {
        throw new GraphQLError("You cannot follow yourself");
      }

      const user = await models.User.findById(userId);
      if (!user) {
        throw new GraphQLError("User not found");
      }

      const existingFollow = await models.Follow.findOne({
        following: user._id,
        follower: currentUser.id,
      });

      if (existingFollow) {
        await Promise.all([
          existingFollow.deleteOne(),
          models.User.findByIdAndUpdate(currentUser.id, {
            $inc: { followingCount: -1 },
          }),
          models.User.findByIdAndUpdate(user._id, {
            $inc: { followersCount: -1 },
          }),
        ]);
        return {
          success: true,
          following: false,
          message: "Unfollowed user",
        };
      }

      await Promise.all([
        models.Follow.create({ follower: currentUser.id, following: user._id }),
        models.User.findByIdAndUpdate(currentUser.id, {
          $inc: { followingCount: 1 },
        }),
        models.User.findByIdAndUpdate(user._id, {
          $inc: { followersCount: 1 },
        }),
      ]);

      return {
        success: true,
        following: true,
        message: "Followed user",
      };
    },

    // Profile
    updateProfile: async (
      _: any,
      args: any,
      { currentUser, models }: GraphQLContext
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Not authorized");
      }

      const { name, bio, avatar } = UpdateProfileSchema.parse(args);

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (bio !== undefined) updates.bio = bio;
      if (avatar !== undefined) updates.avatar = avatar;

      const updatedUser = await models.User.findByIdAndUpdate(
        currentUser.id,
        updates,
        { new: true }
      );

      if (!updatedUser) throw new GraphQLError("User not found");

      return {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      };
    },
  },
};

export default resolvers;
