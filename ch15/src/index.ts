// /src/index.ts

// GraphQL Yoga 및 스키마 생성 도구를 가져옵니다.
// - createYoga: GraphQL 서버 인스턴스를 생성
// - createSchema: 스키마 정의(typeDefs + resolvers)를 바탕으로 실행 가능한 스키마를 생성
import { createYoga, createSchema } from 'graphql-yoga';

// Node.js의 기본 HTTP 서버를 사용해 Yoga를 구동합니다.
import { createServer } from 'http';

// 도메인별로 정의된 GraphQL 스키마(typeDefs)와 리졸버(resolvers)를 불러옵니다.
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// 요청(context)에 Prisma 등 의존성 주입을 위한 함수
// → 각 요청별로 컨텍스트에 접근 가능 (예: ctx.prisma)
import { createContext } from './context';

// 로깅 유틸: winston 등의 커스텀 로그 구현체
// → log level (debug/info/warn/error)을 일관된 포맷으로 출력
import { logger } from './utils/logger';

// GraphQL Yoga 서버 인스턴스 생성
const yoga = createYoga({
  // 실행 가능한 스키마를 생성 (타입 정의 + 리졸버 통합)
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  // 요청별 context 함수 지정 (Prisma 클라이언트, 인증 정보 등 주입 가능)
  context: createContext,

  // plugins 옵션은 현재 사용하지 않음
  plugins: undefined,

  // 로그 레벨에 따라 커스텀 로거 연결 (winston 등 활용 가능)
  logging: {
    // GraphQL 내부에서 발생하는 로그를 개발자가 만든 logger 포맷으로 출력
    debug: (msg: string, meta?: unknown) => logger.debug(msg, meta),
    info: (msg: string, meta?: unknown) => logger.info(msg, meta),
    warn: (msg: string, meta?: unknown) => logger.warn(msg, meta),
    error: (msg: string, meta: unknown) => logger.error(msg, meta),
  },
});

// Node.js의 HTTP 서버 생성 및 Yoga 핸들러 연결
const server = createServer(yoga);

// 서버 시작: 4000번 포트에서 리스닝
server.listen(4000, () => {
  console.log('✅ GraphQL Yoga 서버가 실행 중입니다: http://localhost:4000');
});
