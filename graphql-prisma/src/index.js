import { GraphQLServer, PubSub } from "../node_modules/graphql-yoga/dist";
import { dummyData } from "./db/db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";

//run the prisma.js file
import "./prisma";

const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Post,
  User,
  Comment
};

const GQLServerConfig = {
  typeDefs: "./src/schema.graphql", //path must be absolute from root
  resolvers,
  context: {
    db: dummyData, // context here is = ctx arg passed to all resolvers. is a form of state fo GraphQL
    pubsub
  }
};

const server = new GraphQLServer(GQLServerConfig);
server.start(() => {
  console.log("Server is UP AND RUNNING! \n");
});
