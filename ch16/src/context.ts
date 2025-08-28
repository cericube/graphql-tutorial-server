// /src/context.ts

import { PrismaClient } from './generated/prisma';
const prisma = new PrismaClient();

import { UserService } from './modules/user/user.service';
const userService = new UserService(prisma);

export interface GraphQLContext {
  services: {
    userService: UserService;
  };
}

export const createContext = (): GraphQLContext => ({
  services: {
    userService,
  },
});
