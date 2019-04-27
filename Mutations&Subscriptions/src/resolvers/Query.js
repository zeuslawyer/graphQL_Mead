const Query = {
  users(parent, args, { db }, info) {
    //if no query params from client
    if (!args.name) {
      return db.usersArray;
    }
    //else
    return db.usersArray.filter(user => {
      return user.name.toLowerCase().includes(args.name.toLowerCase());
    });
  },

  posts(parent, args, { db }, info) {
    // if no title query param
    if (!args.titleOrBody) {
      return db.postsArray;
    }

    return db.postsArray.filter(post => {
      let query = args.titleOrBody.toLowerCase();
      let titleMatches = post.title.toLowerCase().includes(query);
      let bodyMatches = post.body.toLowerCase().includes(query);
      return titleMatches || bodyMatches;
    });
  },

  comments(parent, args, { db }, info) {
    //match query param if it exists
    if (args.id) {
      return db.comments.filter(comm => {
        return args.id === comm.id;
      });
    }
    //else
    return db.comments;
  }
};

export default Query;
