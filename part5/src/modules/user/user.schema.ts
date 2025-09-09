export const userTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    nickname: String!
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  input CreateUserInput {
    nickname: String!
    email: String!
  }

  input UpdateUserInput {
    nickname: String
    email: String
  }

  type Query {
    user(id: Int!): User
    users: [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): Boolean!
  }
`;
