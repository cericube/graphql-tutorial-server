// /src/modules/user/user.schema.ts

// GraphQL 스키마 정의 파일입니다.
// userTypeDefs 변수는 GraphQL SDL(Schema Definition Language) 문자열을 포함합니다.
export const userTypeDefs = /* GraphQL */ `
  # 'User'는 GraphQL의 객체 타입(Object Type)입니다.
  # 데이터베이스에서 사용자 정보를 나타내는 모델과 유사합니다.
  # 각 필드(id, email, name 등)는 데이터의 종류를 정의합니다.
  # ! (느낌표)는 해당 필드가 널(null)이 될 수 없음을 의미합니다.
  type User {
    id: Int! # 고유 식별자, 정수 타입이며 필수값입니다.
    email: String! # 사용자 이메일, 문자열 타입이며 필수값입니다.
    name: String! # 사용자 이름, 문자열 타입이며 필수값입니다.
    age: Int # 사용자 나이, 정수 타입이며 선택값입니다 (null 허용).
  }

  # 'CreateUserInput'은 'input' 타입입니다.
  # 이는 뮤테이션(데이터 변경)의 입력값으로 사용될 객체의 구조를 정의합니다.
  # 클라이언트가 createUser 뮤테이션을 호출할 때 이 형식으로 데이터를 보내야 합니다.
  input CreateUserInput {
    email: String! # 신규 유저 생성 시 이메일은 필수입니다.
    name: String! # 이름도 필수입니다.
    age: Int # 나이는 선택사항입니다.
  }

  # 'UpdateUserInput'은 유저 정보를 업데이트하기 위한 'input' 타입입니다.
  # 여기서는 모든 필드가 필수값이 아닙니다.
  # 이는 클라이언트가 이름만, 나이만, 또는 둘 다 업데이트할 수 있도록 허용합니다.
  input UpdateUserInput {
    name: String # 업데이트 시 이름은 선택사항입니다.
    age: Int # 나이 또한 선택사항입니다.
  }

  # 'DeleteResult'는 'type'입니다.
  # 이는 데이터 삭제와 같은 작업의 결과를 클라이언트에 명확히 전달하기 위해 사용됩니다.
  # 일반적으로 작업의 성공 여부와 메시지를 포함합니다.
  type DeleteResult {
    success: Boolean! # 삭제 작업의 성공 여부를 나타내는 불리언(boolean) 타입이며, 필수값입니다.
    message: String! # 작업 결과에 대한 추가 설명(예: "사용자가 성공적으로 삭제되었습니다")을 담는 문자열이며, 필수값입니다.
  }

  # 'Query'는 GraphQL에서 데이터를 조회하는 작업(읽기)을 정의하는 특별한 타입입니다.
  # 스키마에 적어도 하나의 쿼리 타입이 있어야 하므로, 기능이 없더라도 필수로 선언해야 합니다.
  # _empty 필드는 실제 기능은 없지만, Query 타입이 비어 있지 않도록 하는 용도로 사용됩니다.
  type Query {
    _empty: String
  }

  # 'Mutation'은 GraphQL에서 데이터를 변경(쓰기)하는 작업(생성, 수정, 삭제)을 정의하는 특별한 타입입니다.
  # 각각의 필드는 리졸버 함수에 연결되어 실제 데이터 변경 로직을 실행합니다.
  type Mutation {
    # 'createUser'는 새로운 유저를 생성하는 뮤테이션입니다.
    # input 인자를 필수(input!)로 받으며, 반환값은 필수 User 객체(User!)입니다.
    createUser(input: CreateUserInput!): User!

    # 'updateUser'는 기존 유저를 업데이트하는 뮤테이션입니다.
    # 필수 id(Int!)와 필수 input(UpdateUserInput!) 인자를 받습니다.
    # 반환값은 업데이트된 필수 User 객체(User!)입니다.
    updateUser(id: Int!, input: UpdateUserInput!): User!

    # 'deleteUser'는 특정 유저를 삭제하는 뮤테이션입니다.
    # 필수 id(Int!) 인자를 받으며, 반환값은 필수 DeleteResult 객체(DeleteResult!)입니다.
    deleteUser(id: Int!): DeleteResult!
  }
`;
