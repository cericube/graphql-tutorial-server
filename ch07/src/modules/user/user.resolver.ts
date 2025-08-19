// GraphQL SDL에서 작성한 User 타입 정의 가져오기
import { userTypeDefs } from './user.schema';

// 사용자 관련 서비스 로직 모듈
import { userService, UserStatus } from './user.service';

// GraphQL Resolver 정의
// - Query: 데이터 조회용
// - Mutation: 데이터 변경용
export const userResolvers = {
  Query: {
    // 모든 사용자 목록 반환
    users: () => userService.getUsers(),

    // 특정 사용자가 관리자 페이지에 접근할 수 있는지 여부 확인
    // args:
    //  - userId: 확인할 사용자 ID
    canAccessAdminPanel: (_: undefined, { userId }: { userId: string }) =>
      userService.canAccessAdminPanel(userId),
  },
  Mutation: {
    // 사용자 상태 변경
    // args:
    //  - userId: 상태를 변경할 대상 사용자 ID
    //  - newStatus: 새로 적용할 UserStatus Enum 값
    changeUserStatus: (
      _: undefined,
      { userId, newStatus }: { userId: string; newStatus: UserStatus }
    ) => userService.changeUserStatus(userId, newStatus),
  },
};

// SDL 정의도 함께 export하여 스키마 병합 시 사용
export { userTypeDefs };
