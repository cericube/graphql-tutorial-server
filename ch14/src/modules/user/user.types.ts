// /src/modules/user/user.types.ts

// CreateUserInput 인터페이스는 새로운 사용자를 생성할 때 필요한 입력 데이터의 구조를 정의합니다.
// 이 인터페이스는 GraphQL 스키마의 'CreateUserInput'과 직접적으로 매핑됩니다.
export interface CreateUserInput {
  // email 필드는 사용자의 이메일을 나타내는 문자열입니다.
  // GraphQL 스키마에서 느낌표('!')로 표시된 필수 필드이므로,
  // 이 인터페이스에서도 필수 값으로 정의됩니다.
  email: string;

  // name 필드는 사용자의 이름을 나타내는 문자열입니다.
  // 이 역시 필수 값입니다.
  name: string;

  // age 필드는 사용자의 나이를 나타내는 숫자입니다.
  // GraphQL 스키마에서 느낌표가 없는 선택적 필드이므로,
  // TypeScript에서는 '?' 기호를 사용하여 선택적 속성으로 정의합니다.
  // 이는 클라이언트가 age 값을 포함하지 않아도 유효한 입력이 됨을 의미합니다.
  age?: number;
}

// UpdateUserInput 인터페이스는 기존 사용자 정보를 업데이트할 때 사용되는 입력 데이터의 구조를 정의합니다.
// 이 인터페이스는 GraphQL 스키마의 'UpdateUserInput'과 매핑됩니다.
// 모든 필드가 '?' 기호로 선택적(optional) 속성으로 정의되어 있습니다.
// 이는 클라이언트가 name, age 중 하나 또는 둘 다를 업데이트할 수 있음을 의미합니다.
export interface UpdateUserInput {
  // name 필드는 업데이트할 사용자의 이름입니다.
  // 선택적 속성이므로, 클라이언트가 이름 없이 나이만 업데이트하는 것도 가능합니다.
  name?: string;

  // age 필드는 업데이트할 사용자의 나이입니다.
  // 이 역시 선택적 속성입니다.
  age?: number;
}

// DeleteResult 인터페이스는 데이터 삭제 작업의 결과를 나타내는 데 사용됩니다.
// 이는 GraphQL 스키마의 'DeleteResult' 타입과 매핑됩니다.
export interface DeleteResult {
  // success 필드는 삭제 작업이 성공했는지 여부를 나타내는 불리언 값입니다.
  // 필수 값이므로 '?'가 없습니다.
  success: boolean;

  // message 필드는 삭제 작업의 결과에 대한 추가적인 설명을 제공하는 문자열입니다.
  // 예: "사용자가 성공적으로 삭제되었습니다"
  // 이 역시 필수 값입니다.
  message: string;
}
