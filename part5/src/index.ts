import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

import { createContext } from './context';

console.log('debug');

const yoga = createYoga({
  //  이 구문은 GraphQL 서버가 처음 시작될 때 단 한 번 실행되어,
  // GraphQLSchema 인스턴스를 생성합니다.

  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  // 모든 요청에 대해 독립된 context 환경을 제공
  // GraphQL 쿼리를 2번 보내면, createContext() 함수도 2번 실행되고, 각각 독립된 context가 생성됩니다.
  context: createContext,

  plugins: undefined,
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
