const Query = {
  users(parent, args, { prisma }, info) {

    // console.log(JSON.stringify(info, null, 2));
    // console.log(JSON.stringify(args, null, 2))

    const opArgs = {}; //operational argument object initially empty => null

    if (args.nameOrEmail) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.nameOrEmail
          },
          {
            email_contains: args.nameOrEmail
          }
        ]
        // name_contains : args.nameOrEmail,
        // email_contains: args.nameOrEmail
      };
    }

    return prisma.query.users(opArgs, info);

    //else
    // return db.usersArray.filter(user => {
    //   return user.name.toLowerCase().includes(args.name.toLowerCase());
    // });
  },

  posts(parent, args, { prisma }, info) {
    return prisma.query.posts(null, info);
    // if no title query param
    // if (!args.titleOrBody) {
    //   return db.postsArray;
    // }

    // return db.postsArray.filter(post => {
    //   let query = args.titleOrBody.toLowerCase();
    //   let titleMatches = post.title.toLowerCase().includes(query);
    //   let bodyMatches = post.body.toLowerCase().includes(query);
    //   return titleMatches || bodyMatches;
    // });
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
