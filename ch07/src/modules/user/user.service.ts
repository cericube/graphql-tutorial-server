// 사용자 역할(Role) Enum
// - ADMIN: 관리자
// - MANAGER: 매니저
// - USER: 일반 사용자
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

// 사용자 상태(Status) Enum
// - ACTIVE: 활성
// - INACTIVE: 비활성
// - SUSPENDED: 정지
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// User 데이터 구조 정의
// - role: UserRole Enum 타입 사용
// - status: UserStatus Enum 타입 사용
export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// 메모리 기반 샘플 사용자 목록
// (실무에서는 DB에서 조회하는 부분)
const users: User[] = [
  { id: '1', email: 'admin@test.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE },
  { id: '2', email: 'manager@test.com', role: UserRole.MANAGER, status: UserStatus.INACTIVE },
  { id: '3', email: 'user@test.com', role: UserRole.USER, status: UserStatus.SUSPENDED },
];

// 사용자 관련 서비스 로직 집합
export const userService = {
  // 모든 사용자 목록 반환
  getUsers: () => users,

  // 관리자 페이지 접근 가능 여부 확인
  // 조건: 역할이 ADMIN이고 상태가 ACTIVE여야 true 반환
  canAccessAdminPanel: (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return !!user && user.role === UserRole.ADMIN && user.status === UserStatus.ACTIVE;
  },

  // 사용자 상태 변경
  // - userId로 대상 사용자 조회
  // - 정지(SUSPENDED) 상태에서 활성(ACTIVE)로 바로 변경하려고 하면 예외 발생
  changeUserStatus: (userId: string, newStatus: UserStatus) => {
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    if (user.status === UserStatus.SUSPENDED && newStatus === UserStatus.ACTIVE) {
      throw new Error('Suspended accounts cannot be reactivated directly.');
    }
    user.status = newStatus;
    return user;
  },
};
