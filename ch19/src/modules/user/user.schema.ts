// /src/modules/user/user.schema.ts

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    email: String!
    name: String!
    posts: [Post!]!
  }

  type Query {
    users(skip: Int, take: Int): [User!]!
    user(id: Int!): User
  }
`;
