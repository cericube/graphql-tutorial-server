// GraphQL SDL 정의
export const userTypeDefs = /* GraphQL */ `
  # 사용자 역할을 정의하는 Enum
  # - ADMIN: 관리자 권한
  # - MANAGER: 매니저 권한
  # - USER: 일반 사용자
  enum UserRole {
    ADMIN
    MANAGER
    USER
  }

  # 사용자 계정 상태를 정의하는 Enum
  # - ACTIVE: 활성 상태 (서비스 이용 가능)
  # - INACTIVE: 비활성 상태 (로그인 불가)
  # - SUSPENDED: 정지 상태 (관리자에 의해 차단)
  enum UserStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
  }

  # User 타입 정의
  # - id: 사용자 고유 ID
  # - email: 사용자 이메일
  # - role: 사용자 권한 (UserRole Enum 사용)
  # - status: 계정 상태 (UserStatus Enum 사용)
  type User {
    id: ID!
    email: String!
    role: UserRole!
    status: UserStatus!
  }

  # 조회(Query) 타입 정의
  type Query {
    # 모든 사용자 목록 조회
    users: [User!]!

    # 특정 사용자가 관리자 페이지에 접근할 수 있는지 여부 확인
    canAccessAdminPanel(userId: ID!): Boolean!
  }

  # 변경(Mutation) 타입 정의
  type Mutation {
    # 사용자 상태 변경
    # - userId: 상태를 변경할 사용자 ID
    # - newStatus: 새로운 계정 상태 (UserStatus Enum 값)
    # - 반환값: 변경된 User 정보
    changeUserStatus(userId: ID!, newStatus: UserStatus!): User!
  }
`;
