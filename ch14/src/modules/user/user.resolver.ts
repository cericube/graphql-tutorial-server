// /src/modules/user/user.resolver.ts

import { GraphQLContext } from '../../context';
import { User } from '../../generated/prisma';
import { CreateUserInput, DeleteResult, UpdateUserInput } from './user.types';

// userResolver 객체는 GraphQL 스키마의 "Mutation" 타입에 대한 리졸버 함수들을 정의합니다.
// 리졸버는 GraphQL 쿼리나 뮤테이션을 처리하고 데이터를 반환하는 함수입니다.
export const userResolver = {
  // Mutation 객체는 사용자의 데이터를 변경(생성, 수정, 삭제)하는 리졸버들을 포함합니다.
  Mutation: {
    /**
     * @description 신규 유저를 생성하는 뮤테이션 리졸버.
     * @param _parent GraphQL 리졸버 체인에서 부모 객체를 의미하지만, 여기서는 사용하지 않으므로 무시됩니다.
     * @param args GraphQL 클라이언트가 요청과 함께 보낸 인자들을 담고 있는 객체입니다.
     * 여기서는 'input' 필드에 CreateUserInput 타입의 데이터가 들어옵니다.
     * @param context GraphQL 서버의 전역 컨텍스트 객체입니다.
     * 'services' 객체를 통해 비즈니스 로직이 담긴 서비스 레이어에 접근합니다.
     * @returns 생성된 User 객체를 반환합니다.
     */
    createUser: async (
      _parent: unknown,
      args: { input: CreateUserInput },
      { services }: GraphQLContext
    ) => {
      // services.userService.createUser 메서드를 호출하여 실제 유저 생성 로직을 실행합니다.
      // input 값은 GraphQL 요청에서 전달받은 데이터입니다.
      return services.userService.createUser(args.input);
    },

    /**
     * @description 기존 유저 정보를 업데이트하는 뮤테이션 리졸버.
     * @param _parent GraphQL 리졸버 체인에서 부모 객체를 의미하며, 여기서는 사용하지 않으므로 무시됩니다.
     * @param args 구조 분해 할당을 통해 'id'와 'input' 인자를 직접 받습니다.
     * 'id'는 업데이트할 유저의 고유 식별자이고,
     * 'input'은 UpdateUserInput 타입의 업데이트 데이터입니다.
     * @param context GraphQLContext를 통해 서비스 레이어에 접근합니다.
     * @returns 업데이트된 User 객체를 Promise로 반환합니다.
     */
    updateUser: async (
      _parent: unknown,
      { id, input }: { id: number; input: UpdateUserInput },
      { services }: GraphQLContext
    ): Promise<User> => {
      // TypeScript의 추론 기능 덕분에 Promise<User> 반환 타입을 생략할 수 있습니다.
      // updateUser 함수는 내부적으로 services.userService.updateUser(id, input)를 호출하며,
      // 이 함수가 이미 Promise<User>를 반환한다고 타입이 명시(user.schema.ts) 되어 있기 때문입니다.
      // 따라서 TypeScript 컴파일러가 최종 반환 타입이 Promise<User>임을 자동으로 추론합니다.
      return services.userService.updateUser(id, input);
    },

    /**
     * @description 특정 유저를 삭제하는 뮤테이션 리졸버.
     * @param _parent GraphQL 리졸버 체인에서 부모 객체를 의미하며, 여기서는 사용하지 않습니다.
     * @param args 구조 분해 할당을 통해 'id' 인자를 직접 받습니다.
     * 'id'는 삭제할 유저의 고유 식별자입니다.
     * @param context GraphQLContext를 통해 서비스 레이어에 접근합니다.
     * @returns 삭제 결과를 담은 DeleteResult 객체를 Promise로 반환합니다.
     */
    deleteUser: async (
      _parent: unknown,
      { id }: { id: number },
      { services }: GraphQLContext
    ): Promise<DeleteResult> => {
      // services.userService.deleteUser 메서드를 호출하여 유저 삭제 로직을 실행합니다.
      // id 값을 전달하여 특정 유저를 삭제합니다.
      return services.userService.deleteUser(id);
    },
  }, // Mutation
};
