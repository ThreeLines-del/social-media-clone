import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

dotenv.config();

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import UserModel from "./models/user.js";
import PostModel from "./models/post.js";
import CommentModel from "./models/comment.js";
import LikeModel from "./models/like.js";
import FollowModel from "./models/follow.js";
import createLoaders from "./context.js";

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("connected to mongoDB");
});

mongoose.set("debug", true);

const app = express();
const httpServer = http.createServer(app);

// Create schema for both HTTP and WS
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create WebSocket server
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });

const serverCleanup = useServer(
  {
    schema,
  },
  wsServer
);

// Create Apollo Server for HTTP
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  introspection: true,
});

(async () => {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let currentUser = null;
        const auth = req.headers.authorization || "";

        if (auth.startsWith("Bearer ")) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            ) as jwt.JwtPayload & { id?: string };

            if (decodedToken?.id) {
              currentUser = await UserModel.findById(decodedToken.id);
            }
          } catch (err: any) {
            console.warn("Invalid token:", err.message);
          }
        }

        return {
          currentUser,
          models: {
            User: UserModel,
            Post: PostModel,
            Comment: CommentModel,
            Like: LikeModel,
            Follow: FollowModel,
          },
          loaders: createLoaders(),
        };
      },
    })
  );

  const PORT = process.env.PORT;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
    );
  });
})();
