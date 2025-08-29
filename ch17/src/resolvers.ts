import { userResolvers } from './modules/user/user.resolver';
import { postResolvers } from './modules/post/post.resolver';

export const resolvers = [
  userResolvers, // 사용자 관련 리졸버 통합 객체
  postResolvers, // 게시글 관련 리졸버 통합 객체
];
