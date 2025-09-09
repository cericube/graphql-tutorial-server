export const postTypeDefs = /* GraphQL */ `
  # graphql-scalars
  scalar DateTime

  type Post {
    id: Int!
    title: String!
    content: String!
    createdAt: DateTime!
    likeCount: Int!
    author: User!
    comments: [Comment!]!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: Int!
  }

  input UpdatePostInput {
    title: String
    content: String
  }

  type Query {
    posts: [Post!]!
    post(id: Int!): Post
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: Int!, input: UpdatePostInput!): Post!
    deletePost(id: Int!): Boolean!
  }
`;
