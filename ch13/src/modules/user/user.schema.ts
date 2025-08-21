// src/modules/user/user.schema.ts

// userTypeDefs는 User 관련 GraphQL 타입 정의를 포함합니다.
export const userTypeDefs = /* GraphQL */ `
  # User 타입은 사용자 정보를 나타냅니다.
  type User {
    # 사용자의 고유 ID
    id: Int!
    # 사용자의 이메일 주소
    email: String!
    # 사용자의 이름
    name: String!
  }

  # Query 타입은 데이터를 조회하는 API를 정의합니다.
  type Query {
    # ID로 특정 사용자를 조회합니다.
    getUser(id: Int!): User!
  }

  # Mutation 타입은 데이터를 생성/수정/삭제하는 API를 정의합니다.
  type Mutation {
    # 새로운 사용자를 생성합니다.
    createUser(email: String!, name: String!): User!
  }
`;
