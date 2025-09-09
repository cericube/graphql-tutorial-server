import { userTypeDefs } from './modules/user/user.schema';
import { postTypeDefs } from './modules/post/post.schema';
import { commentTypeDefs } from './modules/comment/comment.schema';

export const typeDefs = [
  userTypeDefs, // 사용자 관련 스키마
  postTypeDefs,
  commentTypeDefs,
];
