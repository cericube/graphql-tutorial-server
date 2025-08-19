// src/modules/user/user.schema.ts

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;
