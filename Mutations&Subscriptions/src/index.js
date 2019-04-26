import { GraphQLServer } from "../node_modules/graphql-yoga/dist";
import uuidv4 from "uuid/v4";

const typeDefs = `
    type Query {  
        users (name: String) : [User!]!
        posts (titleOrBody: String) : [Post!]!
        comments(id: ID) : [Comment!]!
    }

    type Mutation {
      createUser(userData: CreateUserInputs) : User!
      createPost(postData: CreatePostInputs): Post!
      createComment(commentData: CreateCommentInputs): Comment!
    }

    input CreateUserInputs {
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInputs {
      title: String!
      body: String!
      published: Boolean
      authorID: ID!
    }
    
    input CreateCommentInputs {
      text: String!
      authorID: ID!
      postID: ID!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!,
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

const resolvers = {
  Query: {
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
    comments(parent, args, ctx, info) {
      //match query param if it exists
      if (args.id) {
        return dummyData.comments.filter(comm => {
          return args.id === comm.id;
        });
      }
      //else
      return dummyData.comments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      //check if email already exists
      const emailExists = dummyData.usersArray.some(user => {
        return user.email === args.userData.email;
      });

      if (emailExists) {
        throw new Error("Email aready registered.");
      }

      //if new user...
      const user = {
        id: uuidv4(),
        ...args.userData
      };
      dummyData.usersArray.push(user);
      return user;
    },

    createPost(parent, args, ctx, info) {
      const {title, body, published, authorID} = args.postData;

      // check if author exists
      const authorExists = dummyData.usersArray.some(user => {
        return user.id === authorID;
      });

      if (!authorExists) {
        throw new Error("You are not a registered user.");
      }

      // user is registered so create new post...
      const newPost = {
        id: uuidv4(),
        body,
        author: authorID,
        title,
        published
      };

      dummyData.postsArray.push(newPost);
      return newPost;
    },

    createComment(parent, args, ctx, info) {
      const { text, authorID, postID } = args.commentData;

      const authorExists = dummyData.usersArray.some((user) =>  user.id === authorID );

      const postPublished = dummyData.postsArray.some((post)=> post.id===postID && post.published)

      if (!authorExists) throw new Error("User not found");
      if ( !postPublished) throw new Error("Unable to find post");

      //else if user is registered, create & save comment
      const newComment = {
        id: '_com'+uuidv4(),
        text,
        author: authorID,
        post: postID
      };
      dummyData.comments.push(newComment);

      return newComment;
    }
  },

  //RELATIONAL DATA
  Post: {
    author(parent, args, ctx, info) {
      return dummyData.usersArray.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      // console.log(parent);
      return dummyData.comments.filter(comment => {
        return comment.post === parent.id;
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
    },
    comments(parent, args, ctx, info) {
      // console.log(parent)
      return dummyData.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return dummyData.usersArray.find(user => {
        return parent.author === user.id;
      });
    },
    post(parent, args, ctx, info) {
      return dummyData.postsArray.find(post => {
        // console.log(parent.post === post.id);
        return parent.post === post.id;
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
      id: `post1`,
      title: "This is a post title!",
      body: "and this...is the body of the post that was posted",
      published: true,
      author: "11"
    },
    {
      id: `post2`,
      title: "What? Coding? Urk.",
      body: "this common reaction is unfortunate....",
      published: false,
      author: "11"
    },
    {
      id: `post3`,
      title: "What happened to Right Said Fred?",
      body: "I was deeply dippy about some of their songs...",
      published: true,
      author: "33"
    }
  ],
  comments: [
    {
      text: "this is comment #1",
      id: "comm1",
      author: "11",
      post: "post1"
    },
    {
      text: "this is comment #2",
      id: "comm2",
      author: "22",
      post: "post2"
    },
    {
      text: "this is comment #3",
      id: "comm3",
      author: "33",
      post: "post3"
    }
  ]
};
