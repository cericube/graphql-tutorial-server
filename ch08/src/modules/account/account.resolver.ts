// account.resolver.ts

// 서비스 로직과 타입 정의를 가져옵니다.
// createAccount: 계정 생성 로직을 담당하는 함수
// CreateAccountInput: 입력 타입 정의
// Account: 반환 타입 정의
import { createAccount, CreateAccountInput, Account } from './account.service';

// GraphQL 스키마의 resolver 구현 객체입니다.
export const resolvers = {
  Mutation: {
    // createAccount Mutation에 대한 resolver 함수 정의
    // GraphQL 스키마에서 input: CreateAccountInput! 구조로 들어오는 데이터를
    // args.input으로 받아 내부 서비스 로직(createAccount)에 위임합니다.
    createAccount: (
      _: unknown, // 첫 번째 인자(root)는 사용하지 않으므로 unknown 처리
      args: { input: CreateAccountInput } // 두 번째 인자(args)에서 input만 구조적으로 추출
    ): Account => {
      // 실제 계정 생성 로직을 호출하고 그 결과를 반환
      return createAccount(args.input);
    },
  },
};
