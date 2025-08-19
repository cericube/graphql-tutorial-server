import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

/**
 * GraphQL Yoga 서버 생성
 * - makeExecutableSchema로 타입과 리졸버 결합
 */
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.log('🚀 Server ready at http://localhost:4000/graphql');
});
