### Technologies / Architecture
- PostGres database, hosted on heroku.  
- Prisma as database ORM for Node
- Prisma-binding nodejs library for the application's backend client 
- Prisma CLI for the schema file generation on terminal

### Docker
Dependency for Prisma.  

CD into the `prisma-project` folder and 
1) run `docker-compose up -d` to load up docker container

2) then ` prisma deploy` to deploy changes in codebase relating to db up to the Heroku PostGres instance.  __note:__ this command often fails if run too quickly after running previous docker command (!!!) so pause a bit or rerun command.
 
The port for the served GraphqL Playground is 4466, as per the `docker-compose.yml` file and the endpoint property in `prisma.yml`.  __note:__ only one `docker-compose.yml` is necessary, and it can sustain multiple projects.


###Prisma & prisma-bindingon Nodejs 
- use the [prisma-binding] (https://github.com/prisma/prisma-binding/blob/master/README.md) library.

- the `prisma.yml` file configures the prisma project and staging. Multiple prisma projects can be run on the same docker container.  Projects must be distinguished by their endpoint names which must include the project name and staging name. 

For example:
```
endpoint: http://localhost:4466/<<project name>> / <<staging name>>
datamodel: datamodel.graphql
```

-- in PGAdmin, go to the database node, then under it look for the `schemas` node. Right click and refresh, and you will see sub nodes with the project name and the staging name separated by a `$` sign, and looking like this:  ` blog$default` and ` bookreviews$default`, where 'blog' and 'bookreviews' are the project names, and 'default' are the staging names.

__How to create typedefs__
use the script `graphql get-schema -p prisma` (which follows the signature `graphql get-schema -p <<project name from .graphqlconfig>>)` from the project root (graphql-prisma) to fetch the graphql schema.  This is saved in the `generated` folder, as per the configuration done in `.graphqlconfig`.  The script itself is configured in `package.json`.

__Prisma object, the Operations, and  arguments__
the `prisma` object (refer to getting started for prisma-binding) has a number of methods on it, for example `prisma.query`, `prisma.mutation` and `prisma.subscription`.  Each of these are JS objects and have as properties, the resolver methods that have been defined on the graphQL operation - i.e. on query, mutation and subscription.

so if querying all users you would use: `prisma.query.users()`. all `prisma-binding` methods take two arguments:
- the operation arguments (input query params/  data objects that need to be passed into the query) || 'null ; and
- the returned selection set properties, expressed as a __string__ - i.e. the properties of the returned data that we want, which the GraphQL specification requires we specify for every query we want returned.

It looks like this:  `prisma.query.users(null, '{ id name email  }')`. The first argument are the operations to be conducted and the second argument is a _string_ of the 'selection set', i.e. the fields in the data that we want returned by the query.  This method call above is the same as the following graphQL playground query:
```
query{
  users{
    id
    name
    email
    }
  }
}
```
_NOTE ON QUERY ARGUMENTS_: 
- as noted above, the first argument is an _object_ of the operational arguments that the query is composed of (i.e. the query's params, if any, that the results need to be filted by)

- the second argument can be string, as above, or `null` (=>returns all __scalar__ fields) or an object. Spefically, the `info` object that graphql passes into all queries, i.e. the holy 4 arguments: `parent`, `args`, `ctx` and `info`.  The `info` object contains the operations that the user passed in (via the client) which is what we want to send back to the graphql server usually.

__promise chaining with prisma operations__
since prisma operations return promises, multiple operations can be chained together by making each operation return the next operation.  
Operations include:  `prisma.query` , `prisma.subscription`, `prisma.mutation` and `prisma.exists`
Example:

```
prisma.mutation.createPost({
    data:{
        title: "How to use the Prisma Bindings package- Part I",
        body: " first download and install the npm package, and then create a prisma object...",
        published: true,
        author: {
            connect : {
                id: "cjva7rlzj00ze08904p6frg6b"
            } 
        }
    }
}, '{ id title published}')
.then(data=> { 
  console.log(JSON.stringify(data, null, 2))
  return prisma.query.users(null, '{ id name email posts { id title } }')
})
.then(users => {
  console.log(JSON.stringify(users, null, 2))
})
.catch(error=>console.log(error));



// ************AND****************


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

```