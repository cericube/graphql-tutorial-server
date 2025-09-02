import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

import { createContext } from './context';

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  context: createContext,

  plugins: undefined,
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
