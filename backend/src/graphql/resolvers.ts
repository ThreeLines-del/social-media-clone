import { GraphQLError } from "graphql";
import { GraphQLContext, IUser } from "../types-schemas/types.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  UserLoginSchema,
  UserRegisterSchema,
} from "../types-schemas/zod-schemas.js";

const resolvers = {
  // Users
  Query: {
    me: (root: any, args: any, { currentUser }: GraphQLContext) => {
      if (!currentUser) throw new GraphQLError("not authorized");
      return currentUser;
    },

    user: async (
      root: any,
      args: any,
      { models }: GraphQLContext
    ): Promise<IUser> => {
      const { username } = args;
      const user = await models.User.findOne({ username });

      return user;
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
  },
};

export default resolvers;
