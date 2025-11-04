// /src/modules/auth/auth.resolver.ts

import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../../context';

export const authResolvers = {
  Query: {
    /**
     * isAuthenticated: User
     * - 현재 인증된 사용자의 정보를 반환합니다.
     * - 인증되지 않은 경우 GraphQLError를 발생시킵니다.
     */
    isAuthenticated: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('유효하지 않은 인증 정보입니다.', {
          extensions: { code: 'INVALID_USER' },
        });
      }
      return context.user;
    },
  },

  Mutation: {
    /**
     * login(email: String!, password: String!): AuthPayload!
     * - 이메일과 비밀번호로 사용자를 인증하고, 액세스 토큰과 리프레시 토큰을 발급합니다.
     */
    login: async (
      _parent: unknown,
      args: { email: string; password: string },
      context: GraphQLContext
    ) => {
      return context.services.authService.login(args.email, args.password);
    },

    register: async (
      _parent: unknown,
      args: { email: string; password: string; name?: string },
      context: GraphQLContext
    ) => {
      return context.services.authService.register(args.email, args.password, args.name);
    },

    refreshToken: async (_parent: unknown, args: { token: string }, context: GraphQLContext) => {
      return context.services.authService.refreshToken(args.token);
    },

    changePassword: async (
      _parent: unknown,
      args: { oldPassword: string; newPassword: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new GraphQLError('유효하지 않은 인증 정보입니다.', {
          extensions: { code: 'INVALID_USER' },
        });
      }
      return context.services.authService.changePassword(
        context.user.email,
        args.oldPassword,
        args.newPassword
      );
    },

    logout: async () => {
      console.log('logout mutation called');
      return true;
    },
    //logout
  },
};
