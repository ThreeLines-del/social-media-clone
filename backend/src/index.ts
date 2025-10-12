import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";

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

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
    );
  });
})();
