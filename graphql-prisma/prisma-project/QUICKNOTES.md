#### Technologies / Architecture
PostGres database, hosted on heroku.  

#### Docker
Dependency for Prisma.  

run `docker-compose up -d` to load up docker container

then ` prisma deploy` to deploy changes in codebase relating to db.  __note:__ this command often fails if run too quickly after running previous docker command (!!!) so pause a bit or rerun command.
 
The port is 4466, as per the `docker-compose.yml` file and the endpoint property in `prisma.yml`.