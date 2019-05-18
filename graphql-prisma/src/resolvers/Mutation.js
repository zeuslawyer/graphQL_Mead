import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT = 10;
const JWT_SECRET = "jwt-secret";

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

    //password validation - length
    let { password } = args.userData;

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    //hash password
    password = await bcrypt.hash(password, SALT);

    //return the promise with returned data with selection set from info
    const user = await prisma.mutation.createUser({
      data: {
        ...args.userData,
        password: password
      }
    }); //info is no longer in second argument as we want ALL SCALAR fields returned

    return {
      user,
      token: jwt.sign({ id: user.id }, JWT_SECRET)
    };
  },

  async loginUser(parent, args, { prisma }, info) {
    const { email, password } = args.login;

    //find and fetch user, for password hash
    const user = await prisma.query.user({
      where: { email }
    });

    //throw error if no user
    if (!user) {
      throw new Error(
        `Email not found. This email -  ${email} - is not registered.`
      );
    }

    //check that user pwd hash matches password submitted
    const hashedpwd = user.password;
    const matched = await bcrypt.compare(password, hashedpwd);

    if (!matched) {
      throw new Error(` Password does not match. `);
    }

    //else j
    return {
      user,
      token: jwt.sign({ id: user.id }, JWT_SECRET)
    };
  },

  async deleteUser(parent, args, { prisma }, info) {
    //check valid user
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error(`No user with  ID ${args.id} exists.`);
    }

    return prisma.mutation.deleteUser(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  updateUser(parent, args, { prisma }, info) {
    const { id, userData } = args;
    // verification of user existence delegated implicitly
    //to prisma - generates a different (less custom) error message
    return prisma.mutation.updateUser(
      {
        where: {
          id: id
        },
        data: userData
      },
      info
    );
  },

  createPost(parent, args, { prisma }, info) {
    const { title, body, published, authorID } = args.postData;
    const dataForPrisma = {
      title,
      body,
      published,
      author: {
        connect: {
          id: authorID
        }
      }
    };
    return prisma.mutation.createPost({ data: dataForPrisma }, info);
  },

  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  updatePost(parent, args, { prisma }, info) {
    let { title, body, published } = args.postData;

    return prisma.mutation.updatePost(
      {
        data: args.postData,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  createComment(parent, args, { prisma }, info) {
    const { text, authorID, postID } = args.commentData;

    return prisma.mutation.createComment(
      {
        data: {
          text: text,
          author: {
            connect: {
              id: authorID
            }
          },
          post: {
            connect: {
              id: postID
            }
          }
        }
      },
      info
    );
  },

  updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment(
      {
        data: args.commentData,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export default Mutation;
