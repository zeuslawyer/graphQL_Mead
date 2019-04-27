//RELATIONAL DATA - resolvers for each CUSTOM data type
const Post = {
    author(parent, args, {db}, info) {
      return db.usersArray.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, {db}, info) {
      // console.log(parent);
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  }

export default Post;