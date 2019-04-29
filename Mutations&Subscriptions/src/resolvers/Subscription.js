import { PubSub } from "graphql-yoga";

const CHANNEL_NAME = 'count'
const INTERVAL_MS =  1000;

const Subscription = {
  count: {
    subscribe: function(parents, args, ctx, info) {
      let count = 0;

      setInterval(()=>{
        count++;

        /**
         * @param CHANNEL_NAME: string
         * @param {} : object with a property that matches the resolver name and value that matches return value of the resolver
         * as set out in schema/ type deg
         */
        ctx.pubsub.publish(CHANNEL_NAME , { count })  
      }, 1000)

      /**
       * asyncIterator takes a single string as argument.  Subscriptions always return this.
       * @param string: name of pubsub channel
       */
      return ctx.pubsub.asyncIterator(CHANNEL_NAME);
    }
  }
};

export default Subscription;
