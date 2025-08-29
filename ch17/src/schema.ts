import { userTypeDefs } from './modules/user/user.schema';
import { postTypeDefs } from './modules/post/post.schema';

export const typeDefs = [
  userTypeDefs, // 사용자 관련 리졸버 통합 객체
  postTypeDefs, // 게시글 관련 리졸버 통합 객체
];
