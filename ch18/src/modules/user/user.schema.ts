// /src/modules/user/user.schema.ts

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    email: String!
    name: String!
    posts: [Post]
  }

  type Query {
    usersWithPosts: [User!]!
    usersWithSelect: [User!]!
    user(id: Int!): User
  }
`;
