// src/modules/user/user.schema.ts

// GraphQL 스키마 정의
// - User 타입과 관련된 Query, Mutation, Input 타입을 선언
// - 이 파일은 서버에서 사용할 데이터 구조와 요청 형태를 명세하는 역할을 함
export const userTypeDefs = /* GraphQL */ `
  # User 객체 타입 정의
  # 클라이언트가 요청 시 받을 수 있는 User 데이터 구조
  type User {
    id: ID! # 고유 식별자 (필수)
    name: String! # 사용자 이름 (필수)
    email: String! # 사용자 이메일 (필수)
  }

  # 사용자 생성 시 입력받을 데이터 구조
  # - name과 email은 필수 값
  input CreateUserInput {
    name: String!
    email: String!
  }

  # 사용자 수정 시 입력받을 데이터 구조
  # - id는 필수 (수정할 대상을 식별)
  # - name과 email은 선택적으로 수정 가능
  input UpdateUserInput {
    id: ID!
    name: String
    email: String
  }

  # 데이터 조회를 위한 Query 타입 정의
  type Query {
    # ID로 특정 사용자 조회
    getUser(id: ID!): User

    # 전체 사용자 목록 조회
    listUsers: [User!]!
  }

  # 데이터 생성·수정·삭제를 위한 Mutation 타입 정의
  type Mutation {
    # 새로운 사용자 생성
    createUser(input: CreateUserInput!): User!

    # 기존 사용자 정보 수정
    updateUser(input: UpdateUserInput!): User!

    # 사용자 삭제 (성공 시 true 반환)
    deleteUser(id: ID!): Boolean!
  }
`;
