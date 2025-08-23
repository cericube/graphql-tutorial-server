// /src/resolvers.ts

// 각 도메인(모듈)별 리졸버를 개별 파일로 분리하여 가져옵니다.
// postResolvers: 게시글(Post) 관련 Mutation 및 Query 처리
// userResolvers: 사용자(User) 관련 Mutation 및 Query 처리
import { postResolvers } from './modules/post/post.resolver';
import { userResolvers } from './modules/user/user.resolver';

//
// 배열 형태로 작성하면 각 도메인 리졸버를 모듈화해 관리할 수 있으며,
// 향후 domain이 추가될 경우 아래에 간단히 추가하는 방식으로 유지보수가 용이합니다.
export const resolvers = [
  postResolvers, // 게시글 관련 리졸버 통합 객체
  userResolvers, // 사용자 관련 리졸버 통합 객체
];
