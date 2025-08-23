// /src/modules/user/user.schema.ts

export const userTypeDefs = /* GraphQL */ `
  # 빈 Query 타입 정의
  # 이 스키마에서는 현재 User에 대한 Query는 없지만,
  # GraphQL 스펙상 Query 타입은 반드시 존재해야 하므로 placeholder로 선언
  type Query {
    _empty: String
  }

  # User 타입 정의
  # 사용자 정보를 나타내는 타입으로, id와 name, 그리고 작성한 게시글 목록을 포함
  type User {
    id: Int! # 사용자 고유 ID (정수형, 필수)
    name: String! # 사용자 이름 (문자열, 필수)
    posts: [Post!]! # 사용자가 작성한 게시글 목록 (Post 타입 배열, null 불가)
  }

  # 사용자 생성 시 클라이언트가 전달해야 할 입력 타입
  # Mutation에서 CreateUser 요청 시 사용됨
  input CreateUserInput {
    name: String! # 생성할 사용자의 이름 (문자열, 필수)
  }

  # Mutation 정의
  # 사용자를 생성하는 createUser 요청을 정의
  # CreateUserInput 타입의 input을 받고, 생성된 User 객체를 반환
  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
`;
