export const commentTypeDefs = /* GraphQL */ `
  # graphql-scalars
  scalar DateTime

  type Comment {
    id: Int!
    content: String!
    createdAt: DateTime!
    postId: Int!
    authorId: Int!
    post: Post!
    author: User!
  }

  input CreateCommentInput {
    postId: Int!
    authorId: Int!
    content: String!
  }

  input UpdateCommentInput {
    id: Int!
    content: String!
  }

  type Query {
    comment(id: Int!): Comment
    commentsByPost(postId: Int!): [Comment!]!
    commentsByUser(userId: Int!): [Comment!]!
    comments: [Comment!]!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment!
    updateComment(input: UpdateCommentInput!): Comment!
    deleteComment(id: Int!): Boolean!
  }
`;
