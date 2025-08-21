// src/modules/user/user.resolver.ts

import { GraphQLContext } from '../../context';

export const userResolver = {
  Query: {
    getUser: async (_: unknown, { id }: { id: number }, { services }: GraphQLContext) => {
      return services.userService.getUserById(id);
    },
  },
  Mutation: {
    createUser: async (
      _: unknown,
      { email, name }: { email: string; name: string },
      { services }: GraphQLContext
    ) => {
      return services.userService.createUser(email, name);
    },
  },
};
