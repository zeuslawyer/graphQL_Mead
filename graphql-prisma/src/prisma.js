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
    const user = await prisma.query.users(
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

createPostForUser("cjva7u9ic010m0890q5y27v4w", {
  title: "Let's use async await!",
  body: " This is how you use async await with prisma bindings....",
  published: true
});



//NOTE: for operation chaining in prisma, refer to the QUICKNOTES.md file in this project's folder

// prisma.mutation.updatePost({
//     data: {
//         body: " this is gnne CHANGE..",
//         published: true
//     },
//     where: {
//         id: "cjvaw01fc001e0890ump0ftsr"
//     }
// }, '{ title body published author {id}}')
// .then(updated=>{
//     console.log('UPDATED POST: \n' , JSON.stringify(updated, null, 2));
//     return prisma.query.posts(null, '{ id title body published author{ name } comments{ text author{ name } } }')
// })
// .then(posts=>console.log('LIST OF POSTS:\n', JSON.stringify(posts, null, 2)))
// .catch(error=>console.log(error));
