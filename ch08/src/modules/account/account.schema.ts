// account.schema.ts

// GraphQL SDL을 문자열로 정의합니다.
// 해당 스키마는 사용자 계정 생성을 위한 Mutation과 그에 필요한 입력 타입(InputObject)을 포함합니다.
export const typeDefs = /* GraphQL */ `
  # 쿼리 타입은 필수로 선언되어야 하므로 placeholder 용도로 _empty 필드를 포함합니다.
  type Query {
    _empty: String
  }

  # 주소 정보를 입력받기 위한 InputObject 타입입니다.
  # 구조화된 입력을 통해 street, city, zipcode를 하나의 address 필드로 그룹화할 수 있습니다.
  input AddressInput {
    street: String!
    city: String!
    zipcode: String!
  }

  # 사용자 프로필 정보를 입력받기 위한 InputObject입니다.
  # 선택 입력 필드로 bio와 website를 정의합니다.
  input ProfileInput {
    bio: String
    website: String
  }

  # 사용자 계정 생성을 위한 최상위 InputObject입니다.
  # 단일 필드 나열이 아닌 구조화된 입력 방식으로 처리합니다.
  input CreateAccountInput {
    name: String! # 사용자 이름 (필수)
    email: String! # 이메일 주소 (필수, 고유값으로 사용 가능)
    password: String! # 비밀번호 (필수, 해싱 대상)
    phone: String # 휴대폰 번호 (선택)
    address: AddressInput # 주소 정보 (선택, 중첩된 InputObject)
    profile: ProfileInput # 프로필 정보 (선택, 중첩된 InputObject)
  }

  # Mutation의 응답으로 반환될 Account 타입입니다.
  # 입력받은 정보 외에도 id 필드를 포함합니다.
  type Account {
    id: ID! # 계정 식별자 (자동 생성)
    name: String!
    email: String!
    phone: String
    address: Address
    profile: Profile
  }

  # AddressInput과 구조가 동일한 Address 출력 타입입니다.
  # 입력(Input)과 출력(Output)을 분리함으로써 명확한 타입 흐름을 제공합니다.
  type Address {
    street: String!
    city: String!
    zipcode: String!
  }

  # ProfileInput과 구조가 동일한 Profile 출력 타입입니다.
  type Profile {
    bio: String
    website: String
  }

  # 계정 생성 Mutation 정의입니다.
  # CreateAccountInput 객체를 단일 인자로 받고, 생성된 Account를 반환합니다.
  type Mutation {
    createAccount(input: CreateAccountInput!): Account!
  }
`;
