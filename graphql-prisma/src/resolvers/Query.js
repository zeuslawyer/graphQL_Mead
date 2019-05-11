const Query = {
  users(parent, args, { prisma }, info) {
    // console.log(JSON.stringify(info, null, 2));
    // console.log(JSON.stringify(args, null, 2))

    const opArgs = {}; //operational argument object initially empty => null

    if (args.nameOrEmail) {
      //add conditional checks to opArgs object...
      opArgs.where = {
        OR: [
          {
            name_contains: args.nameOrEmail //the conditions are taken from the prisma schema, viewable on prisma server :4466
          },
          {
            email_contains: args.nameOrEmail
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);

    //else
    // return db.usersArray.filter(user => {
    //   return user.name.toLowerCase().includes(args.name.toLowerCase());
    // });
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.titleOrBody) {
      //apply filters
      opArgs.where = {
        OR: [
          {
            body_contains: args.titleOrBody
          },
          {
            title_contains: args.titleOrBody
          }
        ],
        AND: [{ published: true }]
      };
    }

    return prisma.query.posts(opArgs, info);
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
