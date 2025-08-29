import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

import { UserService } from './modules/user/user.service';
const userService = new UserService(prisma);

import { PostService } from './modules/post/post.service';

const postService = new PostService(prisma);

export interface GraphQLContext {
  services: {
    userService: UserService;
    postService: PostService;
  };
}

export const createContext = (): GraphQLContext => ({
  services: {
    userService,
    postService,
  },
});
