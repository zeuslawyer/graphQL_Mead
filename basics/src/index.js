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
        me: User!
        post: Post!
        greeting(name: String): String!
        add(a: Float!, b: Float!): Float!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!,
      title: String!
      body: String!
      published: Boolean!,
      author: String

    }
`;

/* 
    Resolvers (methods that implement operations and fetch/return data). 
    Is an object with methods as properties
    follows the schema in type definitions 
*/

const resolvers = {
  Query: {
    me() {
      return {
        id: "23ruj",
        name: "Zubin Pratap",
        email: "zubin@fakemail.com"
      };
    },
    post() {
      return {
        id: `!@$d6web8`,
        title: "This is a post title!",
        body: "and this...is the body of the post that was posted",
        published: true,
        author: "Zubin Pratap"
      };
    },
    greeting(parent, args, ctx, info ){
      console.log(args)
      if (args.name){
        return `Hello, ${args.name}!`
      }

      //else
      return 'Hello, stranger!'
    },
    add(){
      let args = arguments[1]
      return args.a + args.b
    }
//end of resolvers object
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Server running on default port: 4000");
});
