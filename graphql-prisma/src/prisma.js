import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',   //see this folder's QUICKNOTES.md file for explanaton on how the typedefs are created
    endpoint: 'http://localhost:4466/',
    secret: 'my-super-secret-secret'
  })
