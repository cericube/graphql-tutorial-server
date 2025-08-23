// /src/context.ts

// PrismaClient 인스턴스를 생성하여 데이터베이스에 연결합니다.
// - PrismaClient는 Prisma가 자동 생성한 DB 클라이언트입니다.
// - 애플리케이션 전체에서 하나의 인스턴스를 공유해야 커넥션 누수나 중복 연결을 방지할 수 있습니다.
// - 이 인스턴스는 아래에서 서비스(UserService, PostService)에 주입됩니다.
import { PrismaClient } from './generated/prisma';
const prisma = new PrismaClient();

// 서비스 클래스들을 import 합니다.
// - 서비스 클래스는 비즈니스 로직을 담당하며, 리졸버에서 직접 DB를 호출하지 않고 서비스에 위임하도록 구조화합니다.
// - 이는 역할 분리(SRP), 테스트 가능성 향상, 재사용성 확보를 위해 중요한 구조입니다.
import { UserService } from './modules/user/user.service';
import { PostService } from './modules/post/post.service';

// PrismaClient를 생성자 인자로 전달하여 서비스 인스턴스를 생성합니다.
// - 이렇게 하면 서비스는 Prisma에 직접 의존하지 않고, 외부에서 주입된 prisma 인스턴스를 사용하게 됩니다.
// - 이 방식은 "의존성 주입(Dependency Injection)"의 전형적인 패턴으로, 테스트 환경에서도 mocking이 가능해지는 이점이 있습니다.
const userService = new UserService(prisma);
const postService = new PostService(prisma);

// GraphQL 요청마다 주입될 context 객체의 타입을 정의합니다.
// - context는 GraphQL Yoga에서 각 리졸버 함수에 자동으로 전달되는 객체이며,
// - 인증 정보, 공통 유틸, 서비스 인스턴스 등을 주입하는 데 사용됩니다.
// - 여기서는 userService, postService를 리졸버에서 편리하게 사용하도록 services로 묶어 전달합니다.
export interface GraphQLContext {
  services: {
    userService: UserService;
    postService: PostService;
  };
}

// 실제 GraphQL 서버에서 context를 생성할 때 호출되는 팩토리 함수입니다.
// - 서버가 요청을 받을 때마다 이 함수가 호출되어 새로운 context 객체를 생성하고 리졸버에 전달됩니다.
// - 이 구조 덕분에 리졸버는 context.services.userService처럼 간단히 접근할 수 있게 됩니다.
export const createContext = (): GraphQLContext => ({
  services: {
    userService,
    postService,
  },
});
