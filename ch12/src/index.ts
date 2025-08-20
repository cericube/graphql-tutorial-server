// src/index.ts

// GraphQL Yoga 및 HTTP 서버 관련 모듈을 임포트합니다.
import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

// GraphQL 타입 정의와 리졸버, 컨텍스트, 로거 유틸을 임포트합니다.
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { logger } from './utils/logger';

import { useErrorHandler } from '@envelop/core';

// GraphQL Yoga 서버 인스턴스 생성
const yoga = createYoga({
  // GraphQL 스키마 생성: 타입 정의와 리졸버를 결합
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  // 각 요청마다 실행되는 컨텍스트 생성 함수
  context: createContext,
  // 플러그인 설정
  // - useErrorHandler: GraphQL 실행 중 발생한 모든 에러를 수집하여 처리
  //   - errors 배열의 각 에러를 JSON 문자열로 변환 후 커스텀 로거에 기록
  // useErrorHandler가 처리하는 에러 타입은 GraphQL 실행 중 발생하는 모든 GraphQLError 객체입니다.
  // 이는 쿼리 실행, 리졸버, 스키마 검증, 인증 등에서 발생한 에러를 포함합니다.
  // errors 매개변수는 GraphQLError[] 타입입니다.

  plugins: [
    useErrorHandler(({ errors }) => {
      for (const error of errors) {
        const logString = JSON.stringify(error, null, 2);
        logger.error(logString);
      }
    }),
  ],
  // 커스텀 로깅 설정
  // - debug, info, warn, error 레벨별로 로그를 남김
  // - 각 로그 함수는 메시지와 추가 메타데이터를 받아 커스텀 로거에 전달
  // logging.error는 GraphQLError를 처리하지 않습니다. 일반 Error 객체만 처리합니다.
  // throw new GraphQLError(...)로 발생한 GraphQL 에러는 logging.error(...)로 자동 전달되지 않습니다.
  logging: {
    debug: (msg: string, meta?: unknown) => logger.debug(msg, meta),
    info: (msg: string, meta?: unknown) => logger.info(msg, meta),
    warn: (msg: string, meta?: unknown) => logger.warn(msg, meta),
    error: (msg: string, meta: unknown) => logger.error(msg, meta),
  },
});

// HTTP 서버 생성 및 GraphQL Yoga 핸들러 등록
const server = createServer(yoga);

// 서버 실행: 4000번 포트에서 시작, 접속 URL 콘솔 출력
server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
