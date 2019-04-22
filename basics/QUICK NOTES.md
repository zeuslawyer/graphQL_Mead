#Operations
Broadly two types - Queries and Mutations.

#typeDefs
This is how you define the type of __Operations__ and the data types of values retrieved.

Data in GraphQL fall into two broad categories. They are: 
1) scalar types (store a single, discrete value). 
2) collections of scalars (objects/arrays)

But the __values__ fall into 5 types...

String | Boolean (true/false) | Int | Float | ID (capitals. often are Strings) 

Each data type needs to have a definition that specifies its name and return type.  
__If the item is guaranteed to NOT be null then add a Bang Operator (!) to it (null safety).__

```
const typeDefs = `
    type Query {            
        name: String!
`;
```

#Resolvers
1) are objects
2) each property correlates to the Operation type (Query or Mutation) defined in the typeDefs object
3) Each property contains methods as properties, one method for each data type returned by the Query
4) these methods return data, which must conform to the type definitions

Resolvers are functions declared and implemented inside a JS object.  Each property of the object must correlate to the Type of data specified in the Type Definitions.

```
const resolvers = {
  Query: {
    name() {
      return `Zubin aka ZeusCoder`;
    }
};
```

To add more queries, add the type definition to the `typeDefs` object and then create an identically named function inside the `resolvers` object.

#Run the GraphQL Server 
First import the server Class from GraphQL Yoga or other Node client of choice:
`import { GraphQLServer } from "graphql-yoga";`

Then, create a new instance of the imported Server Class, and pass it the type definition and resolvers objects. Call the `.start()` method on the server instance and pass it a callback function that does something (in this case, we simply log a message to the console).

```
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("Server running on default port: 4000");
});
```

GraphQL Yoga uses port 4000 as default.
