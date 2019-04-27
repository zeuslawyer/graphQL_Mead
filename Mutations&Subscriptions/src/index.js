import { GraphQLServer } from "../node_modules/graphql-yoga/dist";
import uuidv4 from "uuid/v4";
import {dummyData} from './db/db'


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
      const { title, body, published, authorID } = args.postData;

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

      const authorExists = dummyData.usersArray.some(
        user => user.id === authorID
      );

      const postPublished = dummyData.postsArray.some(
        post => post.id === postID && post.published
      );

      if (!authorExists) throw new Error("User not found");
      if (!postPublished) throw new Error("Unable to find post");

      //else if user is registered, create & save comment
      const newComment = {
        id: "_com" + uuidv4(),
        text,
        author: authorID,
        post: postID
      };
      dummyData.comments.push(newComment);

      return newComment;
    },

    deleteUser(parent, args, ctx, info) {
      //check valid user
      // const userExists = dummyData.usersArray.some(user => user.id === args.id);
      const userIndex = dummyData.usersArray.findIndex(
        user => user.id === args.id
      );

      if (userIndex === -1) {
        throw new Error(`No user with  ID ${args.id} exists.`);
      }

      //else
      const deletedUsers = dummyData.usersArray.splice(userIndex, 1);

      //retain posts and comments authored by others
      const otherPosts = dummyData.postsArray.filter(
        post => post.author != args.id
      );
      let otherComments = dummyData.comments.filter(
        comment => comment.author != args.id
      );

      // filter remaining comments to remove others' comments on posts that no longer exist
      otherPosts.forEach(post => {
        otherComments = otherComments.filter(
          comment => comment.post === post.id
        );
      });

      dummyData.comments = otherComments;
      dummyData.postsArray = otherPosts;

      // return the deleted user object
      return deletedUsers[0];
    },

    deletePost(parent, args, ctx, info) {
      //check if post exists
      const postIndex = dummyData.postsArray.findIndex(
        post => post.id === args.id
      );
      if (postIndex === -1) {
        throw new Error("Post not found.");
      }

      //remove all comments relating to deleted post
      dummyData.comments = dummyData.comments.filter(
        comment => comment.post != args.id
      );

      //update DB
      const removedPost = dummyData.postsArray.splice(postIndex, 1);

      return removedPost[0];
    },

    deleteComment(parent, args, ctx, info) {
      //check comment exists
      const commentIndex = dummyData.comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found.");
      }
      //update DB & return the deleted comment
      const deletedComment = dummyData.comments.splice(commentIndex, 1);
      return deletedComment[0];
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

const GQLServerConfig = {
  typeDefs: "./src/schema.graphql",   //path must be absolute from root
  resolvers
};

const server = new GraphQLServer(GQLServerConfig);
server.start(() => {
  console.log("Server running on default port: 4000");
});


