const Comment = {
    author(parent, args, {db}, info) {
      return db.usersArray.find(user => {
        return parent.author === user.id;
      });
    },
    post(parent, args, {db}, info) {
      return db.postsArray.find(post => {
        // console.log(parent.post === post.id);
        return parent.post === post.id;
      });
    }
  };

export default Comment;