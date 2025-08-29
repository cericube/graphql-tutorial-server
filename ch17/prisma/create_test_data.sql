-- 사용자 삽입
INSERT INTO User (id, name, email, createdAt) VALUES
  (1, 'Alice', 'alice@example.com', '2025-08-01T10:00:00Z'),
  (2, 'Bob', 'bob@example.com', '2025-08-02T11:00:00Z'),
  (3, 'Charlie', 'charlie@example.com', '2025-08-03T12:00:00Z');

-- 게시글 삽입 (authorId = User.id)
INSERT INTO Post (title, content, published, createdAt, authorId) VALUES
  ('GraphQL Basics', 'Introduction to GraphQL', 1, '2025-08-04T09:00:00Z', 1),
  ('Filtering in GraphQL', 'How to filter posts using input types', 1, '2025-08-04T10:00:00Z', 1),
  ('Sorting in GraphQL', 'Sort your queries with ease', 1, '2025-08-05T11:00:00Z', 1),
  ('Nested Resolvers', 'How to resolve relations', 0, '2025-08-05T13:00:00Z', 2),
  ('Custom Scalars', 'Define your own GraphQL scalar types', 1, '2025-08-06T14:00:00Z', 2),
  ('Prisma Pagination', 'Using take and skip with Prisma', 0, '2025-08-06T15:00:00Z', 2),
  ('Input Validation', 'Using Zod for validating input objects', 1, '2025-08-07T16:00:00Z', 3),
  ('Advanced Querying', 'Complex conditions and OR filters', 1, '2025-08-07T17:00:00Z', 3),
  ('Auth in GraphQL', 'JWT-based authentication', 0, '2025-08-08T18:00:00Z', 3),
  ('Realtime GraphQL', 'Subscriptions and live updates', 1, '2025-08-08T19:00:00Z', 3);
