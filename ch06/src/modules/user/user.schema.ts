// src/modules/user/user.schema.ts

/**
 * User 스키마 정의
 * - 기본 Scalar(Int, Float, String, Boolean, ID)와 Custom Scalar(PositiveInt)를 함께 사용
 * - age 필드에는 PositiveInt를 적용해 양수 정수만 허용
 * - Query와 Mutation 모두 제공하여 읽기/쓰기 기능 구현
 */
export const userTypeDefs = /* GraphQL */ `
  # Custom Scalar 선언
  # PositiveInt: 0보다 큰 정수만 허용하는 타입
  scalar PositiveInt

  # User 타입 정의
  type User {
    id: ID! # 고유 식별자 (문자열 처리, Non-Null)
    name: String! # 사용자 이름 (UTF-8 문자열, 필수 값)
    age: Int! # 나이 (정수, 필수 값) - createUser에서는 PositiveInt 사용
    height: Float! # 키 (소수점 포함 가능, 필수 값)
    isActive: Boolean # 활성 상태 (true/false, 선택 값)
  }

  # Query 타입 정의
  type Query {
    # 사용자 정보를 ID로 조회
    # - id: 조회할 사용자 고유 ID
    getUser(id: ID!): User
  }

  # Mutation 타입 정의
  type Mutation {
    # 새 사용자 생성
    # - name: 사용자 이름 (필수)
    # - age: 나이 (PositiveInt, 필수) → 0보다 큰 정수만 허용
    # - height: 키 (Float, 필수)
    createUser(name: String!, age: PositiveInt!, height: Float!): User!
  }
`;
