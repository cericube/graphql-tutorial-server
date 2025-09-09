// import { GraphQLError } from 'graphql';
// import { z } from 'zod';

import { throwInputValidationError } from '../../utils/error.validation';
import { GraphQLContext } from '../../context';
import { CreateUserInput, createUserSchema, UpdateUserInput, updateUserSchema } from './user.dto';

export const userResolvers = {
  Query: {
    user: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.userService.getUserById(args.id);
    },

    users: async (_parent: unknown, args: unknown, context: GraphQLContext) => {
      return context.services.userService.getUsers();
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      args: { input: CreateUserInput },
      context: GraphQLContext
    ) => {
      const result = createUserSchema.safeParse(args.input);
      if (!result.success) {
        throwInputValidationError(result.error);
      }
      // 검증 통과
      return context.services.userService.createUser(result.data);
    },

    updateUser: async (
      _parent: unknown,
      args: { id: number; input: UpdateUserInput },
      context: GraphQLContext
    ) => {
      const result = updateUserSchema.safeParse(args.input);
      if (!result.success) {
        throwInputValidationError(result.error);
      }
      // 검증 통과
      return context.services.userService.updateUser(args.id, args.input);
    },

    deleteUser: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.userService.deleteUser(args.id);
    },
  },
};
