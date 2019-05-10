import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql", //see this folder's QUICKNOTES.md file for explanaton on how the typedefs are created
  endpoint: "http://localhost:4466/"
});

// prisma.query.users(null, '{ id name email posts { id title } }')
// .then(data=>console.log('DATA IS: \n', JSON.stringify(data, null, 2)))
// .catch(e=>console.log(e))

// prisma.query.comments(null, '{ id text author { name } post { id title author { name } } }' )
// .then(data=>console.log(JSON.stringify(data, null, 2)))
// .catch(e=>console.log(e));

const createPostForUser = async (userID, data) => {
  try {
    const post = await prisma.mutation.createPost(
      {
        data: {
          ...data,
          author: {
            connect: {
              id: userID
            }
          }
        }
      },
      "{ id }"
    );

    if (post) {
      console.log("SUCCESSFULLY SAVED THIS POST TO DB: \n", post);
    }
  } catch (error) {
    console.log("ERROR creating post:  ", error);
  }

  try {
    const user = await prisma.query.user(
      {
        where: {
          id: userID
        }
      },
      "{ id name email posts {id title published} }"
    );
    console.log("HERE IS THE USER:  ", user);
    return user;
  } catch (error) {
    console.log("ERROR fetching user's info from db... ", error);
  }

  return user;
};

// createPostForUser("cjva7u9ic010m0890q5y27v4w", {
//   title: "Let's use async await!",
//   body: " This is how you use async await with prisma bindings....",
//   published: true
// });

const updatePostForUser = async (postID, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data: {
        ...data
      },
      where: {
        id: postID
      }
    },
    "{ author { id } }"
  );

  if (post)
    console.log(
      "HERE IS THE AUTHOR ID FOR THE UPDATED POST:  ",
      JSON.stringify(post, null, 2)
    );

  const user = await prisma.query.user(
    {
      where: {
        id: post.author.id
      }
    },
    `{ id name email posts { id title published} }`
  );

  if (user)
    console.log("HERE ARE USER DETAILS:   ", JSON.stringify(user, null, 2));

  return user;
};

// updatePostForUser("cjva7uzuj01170890vynj4lfc", {
//   title: "This ol' dog learned some new fandangled tricks!",
//   published: true
// });

//NOTE: for operation chaining in prisma, refer to the QUICKNOTES.md file in this project's folder
