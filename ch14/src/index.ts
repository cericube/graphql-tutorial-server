// GraphQL Yoga와 Node.js의 기본 HTTP 서버 모듈을 import합니다.
// GraphQL Yoga는 GraphQL 서버를 쉽게 구축할 수 있도록 돕는 라이브러리입니다.
import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

// 애플리케이션의 GraphQL 스키마 정의와 리졸버를 가져옵니다.
// typeDefs는 GraphQL 스키마의 타입, 쿼리, 뮤테이션 등을 정의합니다.
// resolvers는 스키마의 각 필드를 실제 데이터와 연결하는 함수들입니다.
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// 각 요청에 대한 컨텍스트 객체를 생성하는 함수를 가져옵니다.
// 컨텍스트는 데이터베이스 연결, 인증 정보, 서비스 객체 등
// 리졸버가 요청을 처리하는 데 필요한 모든 것을 담습니다.
import { createContext } from './context';

// 시스템 로그를 위한 로거 유틸리티를 가져옵니다.
import { logger } from './utils/logger';

// ----------------------------------------------------
// ## GraphQL 서버 인스턴스 설정
// ----------------------------------------------------
// createYoga() 함수를 사용하여 GraphQL Yoga 서버 인스턴스를 생성합니다.
const yoga = createYoga({
  // 스키마를 생성하고 연결합니다.
  // createSchema() 함수는 GraphQL 스키마를 구성하는 핵심 부분입니다.
  schema: createSchema({
    // `typeDefs`에 정의된 타입 정보(예: `User`, `Mutation`)를 로드합니다.
    typeDefs,
    // `resolvers`에 정의된 실제 데이터 처리 로직을 연결합니다.
    resolvers,
  }),

  // `context` 옵션에 `createContext` 함수를 할당합니다.
  // GraphQL Yoga는 각 요청이 들어올 때마다 이 함수를 호출하여 컨텍스트를 생성합니다.
  context: createContext,

  // `plugins`는 GraphQL 서버의 기능을 확장하는 데 사용됩니다.
  // 현재 설정에서는 특별한 플러그인을 사용하지 않으므로 'undefined'로 설정되어 있습니다.
  plugins: undefined,

  // `logging` 옵션을 통해 시스템 로그를 세부적으로 설정합니다.
  // 이 설정을 사용하면 GraphQL Yoga의 내부 로그가 개발자가 정의한 로거를 통해 기록됩니다.
  logging: {
    // 로그 레벨별로 `logger` 유틸리티의 해당 함수를 연결합니다.
    // 이렇게 하면 GraphQL Yoga의 로그가 일관된 형식으로 관리됩니다.
    debug: (msg: string, meta?: unknown) => logger.debug(msg, meta),
    info: (msg: string, meta?: unknown) => logger.info(msg, meta),
    warn: (msg: string, meta?: unknown) => logger.warn(msg, meta),
    error: (msg: string, meta: unknown) => logger.error(msg, meta),
  },
});

// ----------------------------------------------------
// ## HTTP 서버 생성 및 시작
// ----------------------------------------------------
// Node.js의 내장 `createServer` 함수를 사용하여 HTTP 서버를 생성합니다.
// 인자로 `yoga` 인스턴스를 전달하여, 이 서버가 GraphQL Yoga의 핸들러를 사용하도록 합니다.
// 즉, 모든 들어오는 HTTP 요청이 `yoga` 인스턴스에 의해 처리됩니다.
const server = createServer(yoga);

// `server.listen()` 함수를 사용하여 지정된 포트(여기서는 4000번)에서 서버를 시작합니다.
// 서버가 정상적으로 시작되면 콜백 함수가 실행됩니다.
server.listen(4000, () => {
  // 서버가 시작되었음을 알리는 메시지를 콘솔에 출력합니다.
  console.log('Server is running on http://localhost:4000');
});
