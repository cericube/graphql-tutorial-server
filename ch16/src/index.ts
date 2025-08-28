// /src/index.ts

import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

import { createContext } from './context';
import { logger } from './utils/logger';

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  context: createContext,

  plugins: undefined,

  logging: {
    // GraphQL 내부에서 발생하는 로그를 개발자가 만든 logger 포맷으로 출력
    debug: (msg: string, meta?: unknown) => logger.debug(msg, meta),
    info: (msg: string, meta?: unknown) => logger.info(msg, meta),
    warn: (msg: string, meta?: unknown) => logger.warn(msg, meta),
    error: (msg: string, meta: unknown) => logger.error(msg, meta),
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('✅ GraphQL Yoga 서버가 실행 중입니다: http://localhost:4000');
});
