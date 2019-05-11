###Technologies used
- graphql yoga for node
- prisma cli
- prisma-bindings nodejs package
- postgres db on heroku free tier
- docker container and pgAdmin (dependencies for prisma-bindings)

### Running the projects
Run `npm install` inside __each__ folder to install node modules. Each folder is its own standalone project that covers the topics suggested by the folder name

##Folders:
1. each folder has its own `/src` folder inside which you can run `npm run start` to fire up the local graphql playground at `port 4000`.
2. Basic concepts of queries etc is n `/basics`
3. Mutations & Subscriptions code, with modularized files is in `/Mutations&Subscriptions`
4. prisma & prisma-bindings (node, docker, postgres) in the `graphql-prisma` folder. 
    - there are two services / endpoints for prisma 
        -- `prisma-project-blog` and
        -- `prisma-project-books`
5. VScode debug tutorial README is in `/VScode_debug_tute`.  The `launch.json` config file for VScode debugging is in `/.vscode/launch.json` (project root).


### QUERIES
_query for posts_
```
query {
  posts{
    id
    published
    title
    author{
    	name    
    }
  }
}
```

_subscription for post CRUD and comments CRUD
```
subscription{
  post{
    mutation
    data{
      id
      title
      body
      author{
        name
      }
      published
    }
  }
}
```

_create posts_ mutation
```
mutation{
  createPost(postData : {
    title: "This is a test post",
    body: " This is going to be deleted ... ",
    authorID : "33",
    published: true
  }){
    id
    published
    title
    body
    author {
      name
    }
  }
}
```

_delete posts_ mutation
```
mutation{
  deletePost(id:"dace4a09-8fda-4a63-8487-903dfe01862d"){
    id
    title
    body
    author{
      name
    }
  }
}
```

_update post_ mutation
```
mutation{
  updatePost(id:"<<  >>", postData: {
    title: "LOOKHERE!!!",
    body: "This is updated body text! ",
    published:  true
  }) {
    id
    published
    title
    body
    author{
      name
    }
  }
}
```


#### Other operations for playground:
```
mutation{
  deleteComment(id:"comm1"){
    text
    post{
      title
    }
    author{
      name
    }
  }


  mutation{
  updateComment(
    id: "comm1", 
    commentData: {text: "here is UPDATED comment text"}){
    author{
      name
    }
    text
    id
  }
}


query{
  posts{
    id
    title
    comments{
      id
      text
      author{
        name
      }
    }
    author{
      name
    }
  }
}

subscription{
  comment(postID: "post1"){
    mutation
    data{
      id
      text
      author{
        name
      }
    }
    
  }
}

```