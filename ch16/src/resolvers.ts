// /src/resolvers.ts

import { userResolvers } from './modules/user/user.resolver';

export const resolvers = [
  userResolvers, // 사용자 관련 리졸버 통합 객체
];
