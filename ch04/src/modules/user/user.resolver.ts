// src/modules/user/user.resolver.ts

import { userService } from './user.service';

export const userResolvers = {
  Query: {
    users: () => userService.getAll(),
    user: (_: unknown, args: { id: number }) => userService.getById(args.id),
  },
  Mutation: {
    createUser: (_: unknown, args: { name: string; email: string }) =>
      userService.create(args.name, args.email),
  },
};
