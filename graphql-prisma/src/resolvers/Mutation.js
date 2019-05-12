import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    //check if email already exists
    // console.log(JSON.stringify(args, null, 2));
    const emailExists = await prisma.exists.User({
      email: args.userData.email
    });

    if (emailExists) {
      throw new Error(
        `User with email ${args.userData.email} aready registered.`
      );
    }

    //return the promise with returned data with selection set from info
    return prisma.mutation.createUser({ data: args.userData }, info);

  },

  async deleteUser(parent, args, { prisma }, info) {
    //check valid user
    const userExists = await prisma.exists.User({id: args.id})

    if(!userExists) {
      throw new Error(`No user with  ID ${args.id} exists.`);
    }

    return prisma.mutation.deleteUser({
      where: {
        id: args.id,
      }
    }, info);
  },

  updateUser(parent, args, ctx, info) {
    const { id, userData } = args;

    //test if email already exists
    if (userData.email) {
      const emailExists = ctx.db.usersArray.some(
        user => user.email === userData.email
      );

      if (emailExists) {
        throw new Error("A user with that email already exists.");
      }
    }

    //find user
    const userIndex = ctx.db.usersArray.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error("No such user found.");
    }

    // update user
    const updatedUserData = { ...ctx.db.usersArray[userIndex], ...userData };
    ctx.db.usersArray[userIndex] = updatedUserData;

    return updatedUserData;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const { title, body, published, authorID } = args.postData;

    // check if post author registered
    const authorExists = db.usersArray.some(user => {
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

    db.postsArray.push(newPost);

    //publish to subscription IF published is set to true
    /**
     * @param string - name of channel, must be identical to what is used in pubsub.asyncIterator()
     * @param object - object with property that matches name of subscription resolver, and value that matches the return type declared in schema
     */
    if (published) {
      pubsub.publish(`postchannel`, {
        post: {
          mutation: "CREATED",
          data: newPost
        }
      });
    }

    return newPost;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    let { title, body, published } = args.postData;

    //check that post exists
    const postIndex = db.postsArray.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("No such post found");
    }

    //create new post object & check if any update fields are EMPTY
    const currentPost = db.postsArray[postIndex];
    title = title || currentPost.title;
    body = body || currentPost.body;
    published = published === undefined ? currentPost.published : published;

    const updatedPost = { ...currentPost, title, body, published };

    db.postsArray[postIndex] = updatedPost;

    // check whether user had toggled 'published status' or has updated something else
    if (currentPost.published && !updatedPost.published) {
      // -> unpublished the post
      //deleted
      pubsub.publish("postchannel", {
        post: {
          mutation: "DELETED",
          data: currentPost //publish only the removed post because that was authorised to be published
        }
      });
    } else if (!currentPost.published && updatedPost.published) {
      //-> unpublished post now published
      //created
      pubsub.publish("postchannel", {
        post: {
          mutation: "CREATED",
          data: updatedPost
        }
      });
    } else if (updatedPost.published) {
      //updated
      pubsub.publish("postchannel", {
        post: {
          mutation: "UPDATED ",
          data: updatedPost
        }
      });
    }

    return updatedPost;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    //check if post exists
    const postIndex = db.postsArray.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found.");
    }

    //remove all comments relating to deleted post
    db.comments = db.comments.filter(comment => comment.post != args.id);

    //update DB, using array destructuring
    const [removedPost] = db.postsArray.splice(postIndex, 1);

    //publish deleted post to subscription channel IF its a published post
    if (removedPost.published) {
      pubsub.publish("postchannel", {
        post: {
          mutation: "DELETED",
          data: removedPost
        }
      });
    }

    return removedPost;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const { text, authorID, postID } = args.commentData;

    const authorExists = db.usersArray.some(user => user.id === authorID);

    const postPublished = db.postsArray.some(
      post => post.id === postID && post.published
    );

    if (!authorExists) throw new Error("User not found");
    if (!postPublished) throw new Error("Unable to find post");

    //else if user is registered, create & save comment to DB
    const newComment = {
      id: "_com" + uuidv4(),
      text,
      author: authorID,
      post: postID
    };

    db.comments.push(newComment);

    //publish to subscription channel for comments, then return new comment
    /**
     * @param string - name of channel, must be identical to what is used in pubsub.asyncIterator()
     * @param object - object with property that matches name of subscription resolver, and value that matches the return type declared in schema
     */
    pubsub.publish("comms_for_post_#" + postID, {
      comment: {
        mutation: "CREATED",
        data: newComment
      }
    });

    return newComment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    //check comment exists
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found.");
    }
    //update DB & return the deleted comment
    const [deletedComment] = db.comments.splice(commentIndex, 1);

    // publish to subscription
    pubsub.publish("comms_for_post_#" + deletedComment.post, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });

    return deletedComment;
  },

  updateComment(parent, args, { db, pubsub }, info) {
    let { text } = args.commentData;

    //check if comment exists
    const commentIndex = db.comments.findIndex(comm => comm.id === args.id);
    if (commentIndex === -1) {
      throw new Error("Comment not found.");
    }

    //check that updatd text is not null or undefined
    const currentComment = db.comments[commentIndex];
    text = text || currentComment.text;
    const newComment = { ...currentComment, text };

    //update db
    db.comments[commentIndex] = newComment;

    //publish to subscription
    pubsub.publish("comms_for_post_#" + currentComment.post, {
      comment: {
        mutation: "UPDATED",
        data: newComment
      }
    });

    return db.comments[commentIndex];
  }
};

export default Mutation;
