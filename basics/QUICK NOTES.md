#Operations
Broadly two types - Queries and Mutations.

#### Operation Arguments
These are used to pass data from the client to server.  There are 4 arguments that get passed to __every__ [resolver](#Resolvers) function. 
The signature for declaring Queries that take operational arguments is:
`nameOfQuery(nameOfArg: <type of arg>): <return type of query> `
```
type Query {           
        greeting(name: String): String!
    }
```




#typeDefs
This is how you define the type of __Operations__ and the data types of values retrieved.

Data in GraphQL fall into two broad categories. They are: 
1) scalar types (store a single, discrete value). 
2) collections of scalars (objects/arrays)

But the __values__ fall into 5 types...(REFER to reference docs)

_String | Boolean (true/false) | Int | Float | ID (capitals. often are Strings) 

Each data type needs to have a definition that specifies its name and return type.  
__If the item is guaranteed to NOT be null then add a Bang Operator (!) to it (null safety).__ This means that items without the exclamation point are "optional".

```
const typeDefs = `
    type Query {            
        name: String!
`;
```

####CUSTOM TYPES
These are almost always non-scalar values, being JS objects with properties that have scalar values.

A custom type definition for a `User` would be:
```
const typeDefs = `
    type Query {            
        me: User!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }
`;
```

The `User` type is declared and defined, and then a Query type is defined with a query of `me`.  See the CUSTOM DATA RESOLVERS section below for how to define resolver functions for custom data types.

#Resolvers
1) are objects
2) each property correlates to the Operation type (Query or Mutation) defined in the typeDefs object
3) Each property contains resolver methods as properties
4) these methods return data, which must conform to the type definitions
5) the methods always get passed 4 arguments: `parent`, `args`, `ctx` (context), and `info` (meta data about operations)

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

####CUSTOM DATA RESOLVERS

The `resolvers` object has a `Query` propertt that matches the `Query` definition in the `typeDefs` object. It has a function declared inside it that has the same name as the property `me` in the `Query` type definition.

```
const resolvers = {
  Query: {
    me() {
      return {
        id: '23ruj',
        name: 'Zubin Pratap',
        email: 'zubin@fakemail.com',
        age: 37  //can be null as per type def
      }
    }
  }
};
```

 A query would then look like:
```
query {
	me {
            name
            age
        }
```

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
