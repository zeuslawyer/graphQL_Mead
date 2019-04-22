import { GraphQLServer } from "graphql-yoga";

// REFERENCE playground: https://graphql-demo.mead.io/

/**
    type definitions AKA schema - data structures and types. 
    Written in the GraphQL query lang, wrapped in back ticks.

    Query -> operation type. ->   always returns a String type
    Other types incl mutation.
*/

const typeDefs = `
    type Query {            
        id: ID!
        location: String!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float    # not null safe - can return EITHER null or Float
    }
`;

/* 
    Resolvers (methods that implement operations and fetch/return data). 
    Is an object with methods as properties
    follows the schema in type definitions 
*/

const resolvers = {
  Query: {
    id() {
      return "abx_#ef9%R241";
    },
    location() {
      return "Melbourne, Australia";
    },
    name() {
      return `Zubin aka ZeusCoder`;
    },
    age() {
      return 37;
    },
    employed() {
      return false;
    },
    gpa() {
      return null;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Server running on default port: 4000");
});
