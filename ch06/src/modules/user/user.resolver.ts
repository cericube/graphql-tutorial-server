//src/modules/user/user.resolver.ts

import { PositiveInt } from './positiveInt.scalar';
import { UserService } from './user.service';

const userService = new UserService();

/**
/**
 * User 리졸버 정의
 * - PositiveInt Custom Scalar 등록
 * - Query, Mutation 구현
 */

export const userResolvers = {
  PositiveInt, // Custom Scalar 등록
  Query: {
    getUser: (_: undefined, { id }: { id: string }) => {
      return userService.getUserById(id);
    },
  },
  Mutation: {
    createUser: (
      _: undefined,
      { name, age, height }: { name: string; age: number; height: number }
    ) => {
      return userService.createUser(name, age, height);
    },
  },
};
