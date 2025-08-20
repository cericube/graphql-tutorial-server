// GraphQL 스키마 정의 파일입니다.
// User 타입과 Query 타입을 정의합니다.

export const userTypeDefs = /* GraphQL */ `
  # 사용자 정보를 나타내는 타입입니다.
  type User {
    id: Int! # 사용자 고유 ID
    name: String! # 사용자 이름
    email: String! # 사용자 이메일
  }

  # 사용자 관련 쿼리 타입입니다.
  type Query {
    user(id: Int!): User # ID로 사용자 정보를 조회합니다.
  }
`;
