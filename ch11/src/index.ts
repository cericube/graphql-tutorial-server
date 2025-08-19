// src/index.ts

// graphql-yoga에서 필요한 함수들을 불러옵니다.
// createYoga: GraphQL 서버 인스턴스를 생성하는 함수
// createSchema: 스키마 정의(typeDefs + resolvers)를 기반으로 실제 실행 가능한 스키마를 생성하는 함수
import { createYoga, createSchema } from 'graphql-yoga';

// HTTP 서버 생성을 위해 Node.js 기본 모듈 사용
import { createServer } from 'http';

// GraphQL 스키마 정의 (typeDefs)와 리졸버 연결
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// context 생성 함수 - 각 요청마다 Prisma 인스턴스를 포함한 context를 생성
import { createContext } from './context';

// Yoga 서버 인스턴스를 생성합니다.
// createSchema를 사용해 typeDefs와 resolvers를 결합한 실행 스키마를 생성하고,
// context를 설정하여 각 요청에서 Prisma Client 등에 접근할 수 있도록 구성합니다.
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: createContext,
});

// HTTP 서버를 생성하고 Yoga 인스턴스를 요청 핸들러로 지정합니다.
const server = createServer(yoga);

// 서버를 4000번 포트에서 실행하고, 성공 시 콘솔에 메시지를 출력합니다.
server.listen(4000, () => {
  console.log('Server ready at http://localhost:4000/graphql');
});
