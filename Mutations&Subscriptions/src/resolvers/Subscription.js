import { PubSub } from "graphql-yoga";

const CHANNEL_NAME = "count";
const COMMENT_CHANNEL_PREFIX = 'comms_for_post_#'
const INTERVAL_MS = 1000;

const Subscription = {
  
  comment: {
    subscribe(parent, args, { pubsub, db }, info) {
      const post = db.postsArray.find(post=> post.id === args.postID && post.published);

      if( !post ) {
          throw new Error ('Post does not exist or is unpublished ')
      }

      //if exists and published...then create the channel subscription
      
      //NOTE: pubsub.publish needs to get called the moment a new comment is created. So in the Mutation resolver!!
      return pubsub.asyncIterator(COMMENT_CHANNEL_PREFIX+`${args.postID}`);
    }
  },
  post: {
    subscribe(parent, args, {pubsub}, info) {
      //NOTE: the pubsub.publish function call is made in the createPost mutation resolver in Mutation.js
      return pubsub.asyncIterator('postchannel')
    }
  }
};

export default Subscription;

// +===========================
// HELPERS
// +===========================

// const publishComment = {
//     subscribe(parent, args, {pubsub}, info){

//     }
// }
