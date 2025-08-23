// /src/modules/user/user.resolver.ts

// GraphQLContext는 각 GraphQL 요청 단위로 생성되는 컨텍스트 객체입니다.
// 이 객체는 Prisma 클라이언트, 인증 정보, 로깅, 도메인별 서비스 계층 등을 담고 있어
// 리졸버에서 다양한 기능에 접근할 수 있도록 도와줍니다.
import { GraphQLContext } from '../../context';

// CreateUserInput은 GraphQL 스키마의 input 타입을 TypeScript로 정의한 것입니다.
// 이는 클라이언트가 보내는 사용자 생성 요청의 구조를 명확하게 타입으로 표현해줍니다.
import { CreateUserInput } from './user.types';

// userResolvers는 GraphQL 스키마의 리졸버 구현체입니다.
// 여기서는 Mutation 중 createUser에 대한 로직을 정의합니다.
export const userResolvers = {
  Mutation: {
    /**
     * createUser는 GraphQL 스키마에 명시된 사용자 생성용 Mutation 필드입니다.
     *
     * 실제로 이 함수는 클라이언트로부터 전달된 사용자 생성 요청(input)을 받아,
     * 사용자 도메인 전용 서비스 계층(userService)을 통해 비즈니스 로직을 수행합니다.
     *
     * @param _parent - GraphQL 리졸버 체인에서 상위(parent) 리졸버 결과입니다. 해당 필드에서는 사용하지 않기 때문에 underscore(_)로 표기합니다.
     * @param args - GraphQL 요청에서 넘어온 인자 객체입니다. 여기서는 args.input에 CreateUserInput 형태의 데이터를 담고 있습니다.
     * @param context - 요청 단위로 생성된 GraphQLContext입니다. context.services.userService를 통해 유저 관련 로직에 접근합니다.
     *
     * @returns 새롭게 생성된 사용자 객체를 반환하며, 이는 클라이언트의 요청 응답으로 전송됩니다.
     */
    createUser: async (
      _parent: unknown,
      args: { input: CreateUserInput },
      context: GraphQLContext
    ) => {
      /**
       * 서비스 계층에 위임:
       * 유저 생성 로직은 단순한 DB insert 이상의 책임을 가집니다.
       * - 이메일/이름 중복 검사
       * - 기본 역할(role) 할당
       * - 비밀번호 해싱(필요시)
       * - 트랜잭션 처리
       * 이런 비즈니스 로직은 서비스 계층(userService)에서 처리되며,
       * 리졸버는 이를 호출만 하도록 얇게 유지하는 것이 좋습니다.
       */
      return context.services.userService.createUser(args.input);
    },
  },
};
