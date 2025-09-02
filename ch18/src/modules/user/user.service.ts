// /src/modules/user/user.service.ts

import { PrismaClient } from '../../generated/prisma';
import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { userIdSchema } from './user.dto';
import { handlePrismaError } from '../../utils/error.helper';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllWithPosts() {
    try {
      const users = await this.prisma.user.findMany({
        include: { posts: true },
      });
      // const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAllWithSelect() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          posts: {
            select: {
              title: true,
              published: true,
              content: true,
            },
          },
        },
      });
      return users;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getUserById(id: number) {
    const result = userIdSchema.safeParse({ id });

    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT', // Apollo 서버 표준 에러 코드
          validationErrors: z.flattenError(result.error), // 상세 오류 정보 제공
        },
      });
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { posts: true },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND', // Apollo 서버 표준 에러 코드
            validationErrors: 'User not found',
          },
        });
      }

      return user;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error; // 반드시 re-throw
      }
      handlePrismaError(error);
    }
  }
}
