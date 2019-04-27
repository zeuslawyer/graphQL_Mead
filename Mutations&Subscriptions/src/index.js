import { GraphQLServer } from "../node_modules/graphql-yoga/dist";
import { dummyData } from "./db/db";
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'


const resolvers = {
 Query,
 Mutation,
 Post,
 User,
 Comment
};

const GQLServerConfig = {
  typeDefs: "./src/schema.graphql", //path must be absolute from root
  resolvers,
  context: {
    db: dummyData // context here is = ctx arg passed to all resolvers. is a form of state fo GraphQL
  }
};

const server = new GraphQLServer(GQLServerConfig);
server.start(() => {
  console.log("Server running on default port: 4000");
});
