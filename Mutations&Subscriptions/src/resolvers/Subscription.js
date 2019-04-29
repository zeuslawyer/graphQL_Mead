import { PubSub } from "graphql-yoga";

const CHANNEL_NAME = "count";
const COMMENT_CHANNEL_PREFIX = 'comms_for_post_#'
const INTERVAL_MS = 1000;

const Subscription = {
  count: {
    subscribe(parents, args, ctx, info) {
      let count = 0;

      setInterval(() => {
        count++;

        /**
         * @param CHANNEL_NAME: string
         * @param {} : object with a property that matches the resolver name and value that matches return value of the resolver
         * as set out in schema/ type deg
         */
        ctx.pubsub.publish(CHANNEL_NAME, { count });
      }, INTERVAL_MS);

      /**
       * asyncIterator takes a single string as argument.  Subscriptions always return this.
       * @param string: name of pubsub channel
       */
      return ctx.pubsub.asyncIterator(CHANNEL_NAME);
    }
  },
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
