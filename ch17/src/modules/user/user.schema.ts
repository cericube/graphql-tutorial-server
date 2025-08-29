// /src/modules/user/user.schema.ts

// GraphQL SDL 문법을 문자열로 작성하여 userTypeDefs로 내보냅니다.
// 해당 스키마는 User 도메인에 대한 타입, 쿼리 정의를 포함합니다.
export const userTypeDefs = /* GraphQL */ `
  # 사용자 정의 Scalar 타입 선언
  # ISO8601 형식의 날짜/시간을 표현하기 위해 Custom Scalar 'DateTime'을 선언합니다.
  # 실제 구현은 schema.ts에서 graphql-scalars 패키지를 통해 연결됩니다.
  scalar DateTime

  # User 타입 정의
  # Prisma의 User 모델과 매핑되며, 클라이언트에 반환할 수 있는 필드 구조를 명세합니다.
  type User {
    id: Int! # 사용자 고유 ID (Primary Key)
    name: String! # 사용자 이름
    email: String! # 사용자 이메일 (고유값)
    createdAt: DateTime! # 생성일자 - ISO 형식의 커스텀 Scalar 사용
    posts: [Post!]! # 해당 사용자가 작성한 게시글 목록 (1:N 관계)
  }

  # Query 루트 정의
  type Query {
    # 전체 사용자 목록을 조회하는 쿼리
    # 예: query { users { id name } }
    users: [User!]!

    # 특정 사용자를 ID 기준으로 조회하는 쿼리
    # 예: query { user(id: 1) { id name email } }
    user(id: Int!): User
  }
`;
