// src/modules/user/user.schema.ts
// ------------------------------------------------------------
// User GraphQL 타입 정의 (Type Definitions)
// ------------------------------------------------------------
// - GraphQL SDL(Schema Definition Language) 문법으로 작성
// - 서버에서 제공할 데이터 타입과 API(Query/Mutation) 구조를 정의합니다.
// - 이 스키마는 리졸버(user.resolver.ts)와 매핑되어 실제 동작을 수행합니다.
// ------------------------------------------------------------

export const userTypeDefs = /* GraphQL */ `
  # User 객체 타입 정의
  # - 클라이언트가 조회할 수 있는 필드와 타입을 명시
  type User {
    id: Int! # 고유 ID (정수, 필수)
    email: String! # 사용자 이메일 (문자열, 필수)
    name: String! # 사용자 이름 (문자열, 필수)
    createdAt: String! # 생성 시각 (ISO 날짜 문자열, 필수)
  }

  # Query 타입 정의
  # - 클라이언트가 호출할 수 있는 조회용 API 목록
  type Query {
    users: [User!]! # 전체 사용자 목록 조회
    user(id: Int!): User # 특정 ID로 사용자 단일 조회
  }
`;
