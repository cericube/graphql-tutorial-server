// /src/context.ts
// -----------------------------------------------------------------------------
// GraphQL 요청 컨텍스트 생성기입니다.
// - PrismaClient: 애플리케이션 전역 싱글턴으로 생성합니다.
// - Service: 전역으로 생성해 의존성 주입합니다.
// - DataLoader: 반드시 "요청 스코프"에서 생성하여 캐시가 요청 간 공유되지 않도록 합니다.
// -----------------------------------------------------------------------------

import { PrismaClient, Prisma, User } from './generated/prisma';
import type DataLoader from 'dataloader';

// PrismaClient 전역 인스턴스입니다.
// - query 이벤트를 활성화하여 SQL과 바인딩 파라미터, 소요 시간을 로깅합니다.
// - 개발 환경에서 N+1 추적에 유용합니다. 운영 환경에서는 과도한 로그를 지양합니다.
const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

// Prisma 쿼리 로깅 훅입니다. (개발/디버깅 용도)
// - e.params는 JSON 문자열입니다. 민감 정보가 포함될 수 있으니 운영에서는 비노출이 안전합니다.
prisma.$on('query', (e: Prisma.QueryEvent) => {
  console.log('[PRISMA] Query:', e.query);
  console.log('[PRISMA] Params:', e.params);
  console.log('[PRISMA] Duration(ms):', e.duration);
});

// 서비스 계층 전역 인스턴스입니다.
// - Prisma 싱글턴을 주입하여 재사용합니다.
import { UserService } from './modules/user/user.service';
const userService = new UserService(prisma);

import { PostService } from './modules/post/post.service';
const postService = new PostService(prisma);

// DataLoader 팩토리입니다. (요청마다 새 로더를 만들어야 합니다)
import { createUserLoader } from './modules/user/user.loader';

// GraphQL 리졸버에 전달할 컨텍스트 타입입니다.
// - services: 비즈니스 로직 계층
// - loaders: N+1 방지를 위한 요청 스코프 로더 모음
export interface GraphQLContext {
  services: {
    userService: UserService;
    postService: PostService;
  };
  loaders?: {
    userById: DataLoader<number, User>;
  };
}

// 요청당 컨텍스트를 생성합니다.
// - DataLoader는 여기서 매 요청마다 생성합니다. (요청 간 캐시 누수 방지)
// - 테스트에서 유연하게 주입할 수 있도록 services는 전역 인스턴스를 사용합니다.
export const createContext = (): GraphQLContext => ({
  services: {
    userService,
    postService,
  },
  loaders: {
    userById: createUserLoader(userService),
  },
});
