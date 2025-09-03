import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
