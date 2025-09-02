// /src/context.ts

// Prisma Client 인스턴스를 생성합니다.
// 이 인스턴스는 DB 쿼리를 수행하는 Prisma ORM의 핵심 객체입니다.
import { PrismaClient } from './generated/prisma';
const prisma = new PrismaClient();

// 각 도메인(service 계층)을 불러와 Prisma 인스턴스를 주입합니다.
import { UserService } from './modules/user/user.service';
const userService = new UserService(prisma);

import { PostService } from './modules/post/post.service';
const postService = new PostService(prisma);

/**
 * GraphQLContext 인터페이스
 *
 * GraphQL 리졸버에 주입될 context의 타입을 정의합니다.
 * 여기서는 도메인별 서비스(UserService, PostService)를 포함합니다.
 *
 * 리졸버에서는 context를 통해 서비스 계층에 접근하여 DB 로직을 수행합니다.
 */
export interface GraphQLContext {
  services: {
    userService: UserService;
    postService: PostService;
  };
}

/**
 * createContext 함수
 *
 * GraphQL 서버 설정 시 호출되며,
 * 각 요청마다 리졸버에 주입할 context 객체를 반환합니다.
 *
 * 이 context는 createYoga() 등 GraphQL 서버 설정에서 다음과 같이 사용됩니다:
 *
 * const yoga = createYoga({
 *   schema,
 *   context: createContext
 * })
 */
export const createContext = (): GraphQLContext => ({
  services: {
    userService,
    postService,
  },
});
