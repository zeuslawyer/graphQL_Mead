import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";

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

    // create JWT out of the ID property
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    return {
      user,
      token
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

    //else
    return {
      user,
      token: jwt.sign({ id: user.id }, JWT_SECRET)
    };
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    //get User ID
    const userID = getUserId(request);

    //only delete this user's profile
    return prisma.mutation.deleteUser(
      {
        where: {
          id: userID
        }
      },
      info
    );
  },

  updateUser(parent, args, { prisma, request }, info) {
    const { userData } = args;
    // verification of user existence delegated implicitly
    //to prisma - generates a different (less custom) error message

    const userID = getUserId(request);

    return prisma.mutation.updateUser(
      {
        where: {
          id: userID
        },
        data: userData
      },
      info
    );
  },

  createPost(parent, args, { prisma, request }, info) {
    const { title, body, published } = args.postData;

    const userID = getUserId(request);

    const dataForPrisma = {
      title,
      body,
      published,
      author: {
        connect: {
          id: userID
        }
      }
    };
    return prisma.mutation.createPost({ data: dataForPrisma }, info);
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userID = getUserId(request);
    const postIsByUser = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userID
      }
    });

    if (!postIsByUser) {
      throw new Error("You cannot delete this Post.");
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const userID = getUserId(request);

    //validate post is by user
    const isPostByUser = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userID
      }
    });

    if (!isPostByUser) {
      return new Error("You cannot update this post.");
    }

    // ELSE
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

  createComment(parent, args, { prisma, request }, info) {
    const userID = getUserId(request);
    const { text, postID } = args.commentData;

    if (!userID) {
      return new Error("You cannot create a comment.");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: text,
          author: {
            connect: {
              id: userID
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

  async updateComment(parent, args, { prisma, request }, info) {
    const userID = getUserId(request);

    //verify comment is by user
    const isCommentByUser = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userID
      }
    });

    if (!isCommentByUser) {
      return new Error("You cannot update this comment.");
    }

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

  async deleteComment(parent, args, { prisma, request }, info) {
    const userID = getUserId(request);
    if (!userID) {
      return new Error("You must be logged in to delete your comments");
    }

    //verify comment is by user
    const isCommentByUser = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userID
      }
    });

    if (!isCommentByUser) {
      return new Error("You cannot delete this comment.");
    }

    // else
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
