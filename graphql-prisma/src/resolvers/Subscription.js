const CHANNEL_NAME = "count";
const COMMENT_CHANNEL_PREFIX = "comms_for_post_#";
const INTERVAL_MS = 1000;

const Subscription = {
  comment: {
    subscribe(parent, args, { prisma }, info) {
      let queryParams = {
        where: {
          node: {
            post: {
              id: args.postID
            }
          }
        }
      };

      return prisma.subscription.comment(queryParams, info);
    }
  },

  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscrption.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  }
};

export default Subscription;
