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

// prisma.mutation.createPost({
//     data:{
//         title: "GraphQL 101",
//         body: " ...part of the mutation challenge...",
//         published: false,
//         author: {
//             connect : {
//                 id: "cjva6i7nz00ic0890tg4q9v70"
//             }
//         }
//     }
// }, '{ id title published}').then(data=>console.log(JSON.stringify(data, null, 2)))
// .catch(error=>console.log(error));

//NOTE: for operation chaining in prisma, refer to the QUICKNOTES.md file in this project's folder


prisma.mutation.updatePost({
    data: {
        body: " TOTALLY changed the body of this post...",
        published: true
    },
    where: {
        id: "cjvaw01fc001e0890ump0ftsr"
    }
}, '{ title body published }')
.then(updated=>{
    console.log('UPDATED POST: \n' , JSON.stringify(updated, null, 2));
    return prisma.query.posts(null, '{ id title body published author{ name } comments{ text author{ name } } }')
})
.then(posts=>console.log('LIST OF POSTS:\n', JSON.stringify(posts, null, 2)))
.catch(error=>console.log(error));