// src/modules/user/user.resolver.ts
// ------------------------------------------------------------
// User 리졸버 정의
// ------------------------------------------------------------
// - GraphQL 요청(Query/Mutation)에 대해 실제 실행되는 함수를 정의합니다.
// - 여기서는 Query 타입의 'users'와 'user'를 구현합니다.
// - 서비스 계층(user.service.ts)을 호출하여 DB 접근 로직을 분리했습니다.
//   → 리졸버는 요청-응답 흐름만 담당, 비즈니스 로직은 서비스 계층에서 관리
// ------------------------------------------------------------

import { userService } from './user.service';

// GraphQL 리졸버 객체
export const userResolvers = {
  Query: {
    // users: 모든 사용자 목록 조회
    // - userService.getAll()을 호출하여 DB에서 전체 User 레코드를 반환합니다.
    users: () => userService.getAll(),

    // user: 특정 사용자 단일 조회
    // - args로 전달된 id를 기반으로 해당 User를 반환합니다.
    // - _: 첫 번째 매개변수는 부모(parent) 객체, 여기서는 사용하지 않으므로 '_'로 표시
    // - args: GraphQL 요청에서 전달된 인자 객체
    user: (_: unknown, args: { id: number }) => userService.getById(args.id),
  },
};
