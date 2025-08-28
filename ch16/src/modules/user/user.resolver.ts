// /src/modules/user/user.resolver.ts

import { GraphQLContext } from '../../context';
import { CreateUserInput } from './dto/create-user.dto';

export const userResolvers = {
  Query: {
    _empty: () => {
      return null;
    },
  },

  Mutation: {
    createUser: async (_: unknown, args: { input: CreateUserInput }, context: GraphQLContext) => {
      return context.services.userService.createUser(args.input);
    },
  },
};
