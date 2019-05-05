
const User = {
    posts(parent, args, {db}, info) {
      return db.postsArray.filter(post => {
        // console.log(parent, post);
        return parent.id === post.author;
        // return post.author === parent.id
      });
    },
    comments(parent, args, {db}, info) {
      // console.log(parent)
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  }

export default User;