//graphql-tutorial-server/ch03/src/index.ts

import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

// GraphQL 서버 생성
const yoga = createYoga({
  schema: createSchema({
    // 1. 타입 정의
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String
      }
    `,
    // 2. 리졸버 정의
    resolvers: {
      Query: {
        hello: () => 'Hello, GraphQL!',
      },
    },
  }),
});

// Node.js HTTP 서버로 실행
const server = createServer(yoga);

server.listen(4000, () => {
  console.log('🚀 Server ready at http://localhost:4000/graphql');
});
