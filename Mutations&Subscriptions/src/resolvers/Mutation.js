import uuidv4 from 'uuid/v4'

const Mutation = {
  createUser(parent, args, { db }, info) {
    //check if email already exists
    const emailExists = db.usersArray.some(user => {
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
    db.usersArray.push(user);
    return user;
  },

  createPost(parent, args, { db }, info) {
    const { title, body, published, authorID } = args.postData;

    // check if author exists
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
    return newPost;
  },

  createComment(parent, args, { db }, info) {
    const { text, authorID, postID } = args.commentData;

    const authorExists = db.usersArray.some(user => user.id === authorID);

    const postPublished = db.postsArray.some(
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

    db.comments.push(newComment);
    return newComment;
  },

  deleteUser(parent, args, { db }, info) {
    //check valid user
    const userIndex = db.usersArray.findIndex(user => user.id === args.id);

    if (userIndex === -1) {
      throw new Error(`No user with  ID ${args.id} exists.`);
    }

    //else
    const deletedUsers = db.usersArray.splice(userIndex, 1);

    //retain posts and comments authored by others
    const otherPosts = db.postsArray.filter(post => post.author != args.id);
    let otherComments = db.comments.filter(
      comment => comment.author != args.id
    );

    // filter remaining comments to remove others' comments on posts that no longer exist
    otherPosts.forEach(post => {
      otherComments = otherComments.filter(comment => comment.post === post.id);
    });

    db.comments = otherComments;
    db.postsArray = otherPosts;

    // return the deleted user object
    return deletedUsers[0];
  },

  deletePost(parent, args, { db }, info) {
    //check if post exists
    const postIndex = db.postsArray.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found.");
    }

    //remove all comments relating to deleted post
    db.comments = db.comments.filter(comment => comment.post != args.id);

    //update DB
    const removedPost = db.postsArray.splice(postIndex, 1);

    return removedPost[0];
  },

  deleteComment(parent, args, { db }, info) {
    //check comment exists
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found.");
    }
    //update DB & return the deleted comment
    const deletedComment = db.comments.splice(commentIndex, 1);
    return deletedComment[0];
  }
};

export default Mutation;
