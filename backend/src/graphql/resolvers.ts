import { GraphQLError } from "graphql";
import { GraphQLContext, IPost, IUser } from "../types-schemas/types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  PostSchema,
  UserLoginSchema,
  UserRegisterSchema,
} from "../types-schemas/zod-schemas.js";
import { Types } from "mongoose";
import { paginate } from "../utils/paginate.js";
import { decodeCursor, encodeCursor } from "../utils/cursorEncodeDecode.js";

const resolvers = {
  // Users
  Query: {
    me: (root: any, args: any, { currentUser }: GraphQLContext): IUser => {
      if (!currentUser) throw new GraphQLError("not authorized");
      return currentUser;
    },

    user: async (
      root: any,
      { username },
      { models }: GraphQLContext
    ): Promise<IUser> => {
      const user = await models.User.findOne({ username });
      return user;
    },

    users: async (
      root: any,
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
      root: any,
      { id },
      { currentUser, models }: GraphQLContext
    ): Promise<IPost> => {
      if (!currentUser) {
        throw new GraphQLError("Not unthorized");
      }

      const post = await models.Post.findById(id);
      return post;
    },

    posts: async (root: any, { first, after }, { models }: GraphQLContext) => {
      const query = {};
      return paginate<IPost>(query, first, after, models.Post);
    },

    feed: async (
      root: any,
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
          // Use _id for cursor ordering
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

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      };
    },
  },

  User: {
    posts: async (root: any, { first, after }, { models }: GraphQLContext) => {
      const userId = root.id;
      let query: any = { author: userId };
      return paginate<IPost>(query, first, after, models.Post);
    },

    followers: async (
      root: any,
      { first, after },
      { models, currentUser }: GraphQLContext
    ) => {
      if (!currentUser) throw new GraphQLError("Not authorized");

      const userId = root.id;
      let query: any = { following: userId };

      if (after) {
        const decoded = decodeCursor(after);
        if (Types.ObjectId.isValid(decoded)) {
          query._id = { $gt: new Types.ObjectId(decoded) };
        }
      }

      const follows = await models.Follow.find(query)
        .sort({ _id: 1 })
        .limit(first + 1)
        .populate("follower");

      const hasNextPage = follows.length > first;
      const edges = follows.slice(0, first).map((follow) => ({
        node: follow.follower,
        cursor: encodeCursor(follow._id.toString()),
      }));

      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      };
    },

    following: async (
      root: any,
      { first, after },
      { models, currentUser }: GraphQLContext
    ) => {
      if (!currentUser) throw new GraphQLError("Not authorized");

      const userId = root.id;
      let query: any = { follower: userId };

      if (after) {
        const decoded = decodeCursor(after);
        if (Types.ObjectId.isValid(decoded)) {
          query._id = { $gt: new Types.ObjectId(decoded) };
        }
      }

      const follows = await models.Follow.find(query)
        .sort({ _id: 1 })
        .limit(first + 1)
        .populate("following");

      const hasNextPage = follows.length > first;
      const edges = follows.slice(0, first).map((follow) => ({
        node: follow.follower,
        cursor: encodeCursor(follow._id.toString()),
      }));

      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      };
    },
  },

  Mutation: {
    // Auth
    register: async (
      root: any,
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
      root: any,
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
      root: any,
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
  },
};

export default resolvers;
