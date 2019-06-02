import getUserId from "../utils/getUserId";
const Query = {
  users(parent, args, { prisma }, info) {
    // console.log(JSON.stringify(info.fieldNodes[0].selectionSet.selections, null, 2));
    // console.log(JSON.stringify(args, null, 2))

    const opArgs = {}; //operational argument object initially empty => null. Gets passed to prisma.query method

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
    const opArgs = {
      where: {
        OR: [
          {
            body_contains: args.titleOrBody
          },
          {
            title_contains: args.titleOrBody
          }
        ]
      }
    };

    // return only published if specified. ignore if published = false
    if (args.published) {
      opArgs.where.published = true;
    }

    return prisma.query.posts(opArgs, info);
  },

  myPosts(parent, args, { prisma, request }, info) {
    const userID = getUserId(request, true);

    // ensure only user's posts are fetched
    const opArgs = {
      where: {
        author: {
          id: userID
        }
      }
    };

    // filter by query
    if (args.query) {
      opArgs.where.OR = [
        {
          body_contains: args.query
        },
        {
          title_contains: args.query
        }
      ];
    }

    //return data
    return prisma.query.posts(opArgs, info);
  },

  async post(parent, args, { prisma, request }, info) {
    const userID = getUserId(request, false);

    // return the post if it is published.  if unpublished, return only if author is the user
    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userID
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) throw new Error("Post not found.");

    //else
    return posts[0];
  },

  comments(parent, args, { prisma }, info) {
    const opArgs = {};
    //filter query paramters in args
    if (args.id) {
      opArgs.where = {
        id: args.id
      };
    }
    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userID = getUserId(request, true);

    return prisma.query.user(
      {
        where: {
          id: userID // if no userID ensure it is null, not undefined
        }
      },
      info
    );
  }
};

export default Query;
