import { GraphQLServer } from "graphql-yoga";

// REFERENCE playground: https://graphql-demo.mead.io/

/*
    type definitions - data structures and types. 
    Written in the GraphQL query lang, wrapped in back ticks
    Query -> operation type. Other types incl mutation
     ->   always returns a String type
*/

const typeDefs = `
    type Query {            #Query -> operation type. Other types incl mutation
        hello: String!      #->   always returns a String type
    }
`;

const resolvers = {
  Query: {
    hello() {
      return `This is my first successful query`;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Server running on default port: 4000");
});

/* 
    Resolvers (functions that implement operations). Is an object with function properties
    follows the schema in type definitions 
*/
