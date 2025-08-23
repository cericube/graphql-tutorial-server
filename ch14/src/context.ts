// /src/context.ts

// PrismaClient 인스턴스를 생성하여 데이터베이스에 연결합니다.
// 이 인스턴스는 애플리케이션 전체에서 단일 인스턴스로 관리되는 것이 효율적입니다.
// 이 PrismaClient는 이후 UserService에 주입(inject)될 것입니다.
import { PrismaClient } from './generated/prisma';
const prisma = new PrismaClient();

// UserService 클래스를 가져옵니다.
// 이 클래스는 실제 사용자 관련 비즈니스 로직을 담고 있습니다.
import { UserService } from './modules/user/user.service';

// UserService 인스턴스를 생성합니다.
// 위에서 생성한 'prisma' 인스턴스를 생성자의 인자로 전달하여 주입합니다.
// 이를 통해 UserService는 데이터베이스에 접근할 수 있게 됩니다.
const userService = new UserService(prisma);

// 'GraphQLContext' 인터페이스는 GraphQL 리졸버 함수에 전달되는 'context' 객체의 타입을 정의합니다.
// 이 컨텍스트는 요청 처리 과정에서 필요한 모든 데이터를 담는 컨테이너 역할을 합니다.
export interface GraphQLContext {
  // 'services' 객체는 애플리케이션의 비즈니스 로직이 담긴 서비스들을 묶어놓습니다.
  // 이 구조를 통해 리졸버는 필요한 서비스에 쉽게 접근할 수 있습니다.
  services: {
    // 'userService' 필드는 UserService 타입의 인스턴스를 가집니다.
    // 리졸버는 이 필드를 통해 .createUser(), .updateUser() 등과 같은
    // 비즈니스 로직 함수들을 호출할 수 있습니다.
    userService: UserService;
  };
}

// 'createContext' 함수는 각 GraphQL 요청이 들어올 때마다 호출되어
// 해당 요청에 대한 컨텍스트 객체를 생성하고 반환합니다.
// 이 함수는 Apollo Server 등의 GraphQL 서버에서 설정됩니다.
export const createContext = (): GraphQLContext => ({
  // services 객체를 생성하고, 위에서 미리 생성해 둔 userService 인스턴스를 할당합니다.
  // 이렇게 함으로써 모든 리졸버는 동일한 서비스 인스턴스를 공유하며,
  // 이를 통해 데이터베이스 접근과 같은 자원을 효율적으로 관리할 수 있습니다.
  services: {
    userService,
  },
});
