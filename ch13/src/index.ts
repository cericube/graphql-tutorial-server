// /src/index.ts

// GraphQL Yoga 및 HTTP 서버 관련 모듈 임포트
import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

// GraphQL 스키마, 리졸버, 컨텍스트, 로거 유틸리티 임포트
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { logger } from './utils/logger';

// GraphQL Yoga 인스턴스 생성
const yoga = createYoga({
  // 스키마 정의: 타입 정의와 리졸버 연결
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  // 요청별 컨텍스트 생성 함수 지정
  context: createContext,

  // GraphQL 에러 로깅은 /utils/error.helper.ts에서 처리됨
  plugins: undefined,

  // 시스템 로그 기록 설정: logger 유틸리티를 통해 로그 레벨별 함수 지정
  logging: {
    debug: (msg: string, meta?: unknown) => logger.debug(msg, meta),
    info: (msg: string, meta?: unknown) => logger.info(msg, meta),
    warn: (msg: string, meta?: unknown) => logger.warn(msg, meta),
    error: (msg: string, meta: unknown) => logger.error(msg, meta),
  },
});

// HTTP 서버 생성 및 GraphQL Yoga 핸들러 등록
const server = createServer(yoga);

// 서버 실행: 4000번 포트에서 HTTP 요청 수신 시작
server.listen(4000, () => {
  // 서버 시작 시 접속 URL 콘솔에 출력
  console.log('Server is running on http://localhost:4000');
});
