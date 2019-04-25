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
        users (name: String) : [User!]!
        posts (titleOrBody: String) : [Post!]!
        greeting(name: String): String!
        add(a: Float!, b: Float!): Float!
        addFloats(numbers: [Float!]!): Float!
        grades: [Int!]!
        comments(id: ID) : [Comment!]!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!,
      author: User!
    }

    type Comment {
      id: ID!
      text: String!
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
      return dummyData.usersArray[0];
    },
    post() {
      return dummyData.postsArray[0];
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
      if (!args.titleOrBody) {
        return dummyData.postsArray;
      }

      return dummyData.postsArray.filter(post => {
        let query = args.titleOrBody.toLowerCase();
        let titleMatches = post.title.toLowerCase().includes(query);
        let bodyMatches = post.body.toLowerCase().includes(query);
        return titleMatches || bodyMatches;
      });
    },

    greeting(parent, args, ctx, info) {
      // console.log(parent, args, ctx, info);
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
    },

    comments(parent, args, ctx, info){
      //match query param if it exists
      if (args.id){
        return dummyData.comments.filter(comm =>{
          return args.id === comm.id
        })
      }
      //else
      return dummyData.comments
    }
  },

  //RELATIONAL DATA
  Post: {
    author(parent, args, ctx, info) {
      return dummyData.usersArray.find(user => {
        return user.id === parent.author;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return dummyData.postsArray.filter(post => {
        // console.log(parent, post);
        return parent.id === post.author;
        // return post.author === parent.id
      });
    }
  }

  //end of resolvers object
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Server running on default port: 4000");
});

var dummyData = {
  usersArray: [
    {
      id: "11",
      name: "Zubin Pratap",
      email: "zubin@fakemail.com"
    },
    {
      id: "22",
      name: "Rowena Horne",
      email: "rowena@fakemail.com"
    },
    {
      id: "33",
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
      author: "11"
    },
    {
      id: `237fdf78gdyfb`,
      title: "What? Coding? Urk.",
      body: "this common reaction is unfortunate....",
      published: false,
      author: "11"
    },
    {
      id: `k8735ybfs`,
      title: "What happened to Right Said Fred?",
      body: "I was deeply dippy about some of their songs...",
      published: true,
      author: "33"
    }
  ],
  comments: [
    {
      text: 'this is comment #1',
      id: 'comm1'
    },
    {
      text: 'this is comment #2',
      id: 'comm2'
    },
    {
      text: 'this is comment #3',
      id: 'comm3'
    }
  ]
};
