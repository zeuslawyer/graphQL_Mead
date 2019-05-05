### Technologies / Architecture
- PostGres database, hosted on heroku.  
- Prisma as database ORM for Node
- Prisma-binding nodejs library for the application's backend client 
- Prisma CLI for the schema file generation on terminal

### Docker
Dependency for Prisma.  

CD into the `prisma-project` folder and 
1) run `docker-compose up -d` to load up docker container

2) then ` prisma deploy` to deploy changes in codebase relating to db.  __note:__ this command often fails if run too quickly after running previous docker command (!!!) so pause a bit or rerun command.
 
The port is 4466, as per the `docker-compose.yml` file and the endpoint property in `prisma.yml`.


###Prisma on Nodejs 
use the [prisma-binding] (https://github.com/prisma/prisma-binding/blob/master/README.md) library.

__How to create typedefs__
use the script `graphql get-schema -p prisma` from the project root (graphql-prisma) to fetch the graphql schema.  This is saved in the `generated` folder, as per the configuration done in `.graphqlconfig`.  The script itself is configured in `package.json`.

