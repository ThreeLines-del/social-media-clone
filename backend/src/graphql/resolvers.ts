import { GraphQLContext } from "../../types-schemas/types.js";

const resolvers = {
  Query: {
    user: async (root, args, { models }: GraphQLContext) => {},
  },
};

export default resolvers;
