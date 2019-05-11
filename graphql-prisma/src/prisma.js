import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql", //see this folder's QUICKNOTES.md file for explanaton on how the typedefs are created
  endpoint: "http://localhost:4466"
});

//NOTE: for operation chaining in prisma, refer to the QUICKNOTES.md file in this project's folder

export default prisma;
// const createPostForUser = async (userID, data) => {
//   //check if userID valid
//   const userExists = await prisma.exists.User({
//     id: userID
//   });

//   if (!userExists) {
//     throw new Error(" CREATE NEW POST FAILED> User does not exist? ");
//   }

//   //create post and return its ID, and author details
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: userID
//           }
//         }
//       }
//     },
//     "{ id author {id name email posts{ id title published }}}"
//   );

//   //check if there was error creating/retrieving
//   if (!post) {
//     throw new Error(" User exists but wasnt able to create new post....\n");
//   }

//   return post.author;
// };

// createPostForUser("cjva7u9ic010m0890q5y27v4w", {
//   title: "I think using async await will work here...!",
//   body: " This is how you use async await with prisma bindings....",
//   published: true
// })
//   .then(author =>
//     console.log("HERE IS THE AUTHOR ...\n", JSON.stringify(author, null, 2))
//   )
//   .catch(err =>
//     console.log(
//       `SOMETHING WENT WRONG: \n ${err}`
//     )
//   );

// const updatePostForUser = async (postID, data) => {
//   //check if posts exists and if not throw error
//   const postExists = prisma.exists.Post({
//     id: postID
//   });

//   if (!postExists) {
//     throw new Error("Post update failed:  Post not found...");
//   }

//   //retrieve post
//   const post = await prisma.mutation.updatePost(
//     {
//       data: {
//         ...data
//       },
//       where: {
//         id: postID
//       }
//     },
//     "{ author { id name email posts { id title published} } }"
//   );

//   //handle retrieve error
//   if (!post) {
//     throw new Error(" Post xists but wasnt able to update....\n");
//   }

//   //return only author details, which includes list of posts
//   return post.author;
// };

// updatePostForUser("cjva7uzuj01170890vynj4lfc", {
//   title: "This dawg is chaining .then to the func calls!",
//   published: true
// })
// .then(user=> console.log("HERE ARE AUTHOR DETAILS:   ", JSON.stringify(user, null, 2)))
// .catch(err => console.log(`SOMETHING WENT WRONG: \n MESSAGE: ${err.message} \n AT:  ${err.path}`) )
