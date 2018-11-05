require("dotenv").config();
import { GraphQLServer, PubSub } from "graphql-yoga";
import prisma from "./prisma";
import resolvers, { fragmentReplacements } from "./resolvers/index";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return {
      prisma,
      request
    };
  },
  fragmentReplacements
});
server.start(({ port }) => console.log("Server is running on port " + port));
