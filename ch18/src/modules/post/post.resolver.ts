// /src/modules/post/post.resolver.ts

import { GraphQLContext } from '../../context';

export const postResolvers = {
  Query: {
    postsWithAuthor: async (_: unknown, __: unknown, context: GraphQLContext) => {
      return context.services.postService.findAllWithAuthor();
    },
  },

  Post: {
    author: async (parent: { authorId: number }, _: unknown, context: GraphQLContext) => {
      return context.services.userService.getUserById(parent.authorId);
    },
  },
};
