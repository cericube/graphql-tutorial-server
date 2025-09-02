// /src/modules/post/post.schema.ts

export const postTypeDefs = /* GraphQL */ `
  type Post {
    id: Int!
    title: String!
    content: String!
    published: Boolean!
    author: User!
  }

  type Query {
    postsWithAuthor: [Post!]!
  }
`;
