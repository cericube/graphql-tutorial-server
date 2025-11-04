// src/modules/auth/auth.service.ts

import { PrismaClient } from '../../generated/prisma';
import { GraphQLError } from 'graphql';

import { z } from 'zod';
import { handlePrismaError } from '../../utils/error.helper';
import { authArgsSchema } from './auth.dto';
import {
  createAccessToken,
  createRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from './auth.jwt';
import { compare } from 'bcryptjs';

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(email: string, password: string, name?: string) {
    const result = authArgsSchema.safeParse({ email, password });
    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: z.flattenError(result.error),
        },
      });
    }
    //

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new GraphQLError('이미 존재하는 이메일입니다.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const hashed = await hashPassword(password);

      const newUser = await this.prisma.user.create({
        data: { email, password: hashed, name },
      });

      return newUser;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      handlePrismaError(error);
    }
  }

  async login(email: string, password: string) {
    const result = authArgsSchema.safeParse({ email, password });
    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: z.flattenError(result.error),
        },
      });
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new GraphQLError('인증에 실패하였습니다.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const valid = await compare(password, user.password);
      if (!valid) {
        throw new GraphQLError('인증에 실패하였습니다.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      handlePrismaError(error);
    }
  }

  async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);

    if (!payload) {
      throw new GraphQLError('유효하지 않은 리프레시 토큰입니다.', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new GraphQLError('인증에 실패하였습니다.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      console.log('User found:', user);

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      console.log('Error refreshing token:', error);
      if (error instanceof GraphQLError) {
        throw error;
      }
      handlePrismaError(error);
    }
  }

  async changePassword(email: string, oldPassword: string, newPassword: string) {
    const result = authArgsSchema.safeParse({ email, oldPassword });
    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: z.flattenError(result.error),
        },
      });
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new GraphQLError('사용자를 찾을 수 없습니다.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const valid = await compare(oldPassword, user.password);
      if (!valid) {
        throw new GraphQLError('기존 비밀번호가 일치하지 않습니다.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const hashed = await hashPassword(newPassword);
      await this.prisma.user.update({
        where: { email },
        data: { password: hashed },
      });

      return true;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      handlePrismaError(error);
    }
  }
}
