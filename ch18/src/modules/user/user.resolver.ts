// /src/modules/user/user.resolver.ts

import { GraphQLContext } from '../../context';

export const userResolvers = {
  Query: {
    usersWithPosts: async (_: unknown, __: unknown, context: GraphQLContext) => {
      return context.services.userService.findAllWithPosts();
    },

    usersWithSelect: async (_: unknown, __: unknown, context: GraphQLContext) => {
      return context.services.userService.findAllWithSelect();
    },

    user: async (_: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.userService.getUserById(args.id);
    },
  },
};
