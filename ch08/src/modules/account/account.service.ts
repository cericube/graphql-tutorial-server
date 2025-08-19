// account.service.ts

// 사용자 주소 정보에 대한 타입 정의
// GraphQL AddressInput과 매핑되며, 내부 속성은 모두 필수 필드입니다.
export interface Address {
  street: string;
  city: string;
  zipcode: string;
}

// 사용자 프로필 정보에 대한 타입 정의
// bio, website는 선택 필드로 정의됩니다.
export interface Profile {
  bio?: string;
  website?: string;
}

// 계정 생성 시 입력받을 구조화된 타입
// GraphQL의 CreateAccountInput 타입과 1:1로 매핑됩니다.
export interface CreateAccountInput {
  name: string; // 사용자 이름 (필수)
  email: string; // 이메일 주소 (필수)
  password: string; // 비밀번호 (필수, 이 예제에서는 저장하지 않지만 실무에선 해싱 필요)
  phone?: string; // 휴대폰 번호 (선택)
  address?: Address; // 주소 정보 (선택, 중첩 구조)
  profile?: Profile; // 프로필 정보 (선택, 중첩 구조)
}

// 계정 정보를 저장하는 타입
// GraphQL의 Account 타입과 대응되며, 입력값 + 생성된 ID 포함
export interface Account {
  id: string; // 고유 ID (서버에서 자동 생성)
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  profile?: Profile;
}

// 메모리 내 계정 저장소 (임시 DB 역할)
// 실제 DB 연동 전 테스트용으로 사용
const accounts: Account[] = [];

// ID를 자동 증가시키기 위한 카운터
let idCounter = 1;

// 계정 생성 함수
// GraphQL Resolver에서 호출되며, 입력값을 기반으로 새로운 계정 객체를 생성하고 저장한 뒤 반환합니다.
export const createAccount = (input: CreateAccountInput): Account => {
  const newAccount: Account = {
    id: String(idCounter++), // ID를 문자열로 생성 (GraphQL ID 타입과 일치)
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    profile: input.profile,
  };

  // 메모리 배열에 계정 추가 (DB 대체)
  accounts.push(newAccount);

  // 생성된 계정 정보 반환
  return newAccount;
};
