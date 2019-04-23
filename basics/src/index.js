import { GraphQLServer } from "graphql-yoga";
import { ADDRCONFIG } from "dns";

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
        users (name: String) : [User!]!
        posts (title: String) : [Post!]!
        greeting(name: String): String!
        add(a: Float!, b: Float!): Float!
        addFloats(numbers: [Float!]!): Float!
        grades: [Int!]!
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
    users(parent, args, ctx, info) {
      //if no query params from client
      if (!args.name) {
        return dummyData.usersArray;
      }
      //else
      return dummyData.usersArray.filter(user => {
        return user.name.toLowerCase().includes(args.name.toLowerCase());
      });
    },

    posts(parent, args, ctx, info) {
      // if no title query param
      if (!args.title) {
        return dummyData.postsArray;
      }

      return dummyData.postsArray.filter((post)=>{
        return post.title.toLowerCase().includes(args.title.toLowerCase())
      })
    },

    greeting(parent, args, ctx, info) {
      console.log(parent, args, ctx, info);
      if (args.name) {
        return `Hello, ${args.name}!`;
      }

      //else
      return "Hello, stranger!";
    },

    add() {
      let args = arguments[1];

      return args.a + args.b;
    },

    grades() {
      return [90, 67, 88];
    },

    addFloats(parent, args, ctx, info) {
      if (args.numbers === 0) return 0;

      //else
      return args.numbers.reduce((accum, currentVal) => {
        return accum + currentVal;
      });
    }
    //end of resolvers object
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Server running on default port: 4000");
});

var dummyData = {
  usersArray: [
    {
      id: "23ruj",
      name: "Zubin Pratap",
      email: "zubin@fakemail.com"
    },
    {
      id: "457yhdf",
      name: "Rowena Horne",
      email: "rowena@fakemail.com"
    },
    {
      id: "983hgd023r",
      name: "Maggie Hound",
      email: "maggie@fakemail.com",
      age: 13
    }
  ],
  postsArray: [
    {
      id: `!@$d6web8`,
      title: "This is a post title!",
      body: "and this...is the body of the post that was posted",
      published: true,
      author: "Zubin Pratap"
    },
    {
      id: `237fdf78gdyfb`,
      title: "What? Coding? Urk.",
      body: "this common reaction is unfortunate....",
      published: false,
      author: "Zubin Pratap"
    },
    {
      id: `k8735ybfs`,
      title: "What happened to Right Said Fred?",
      body: "I was deeply dippy about some of their songs...",
      published: true,
      author: "Maggie Hound"
    }
  ]
};
