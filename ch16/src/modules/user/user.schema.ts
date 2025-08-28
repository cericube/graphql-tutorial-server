// /src/modules/user/user.schema.ts

export const userTypeDefs = /* GraphQL */ `
  type Query {
    _empty: String
  }

  type User {
    id: Int!
    email: String!
    name: String!
    age: Int # nullable — 생략 가능
  }

  input CreateUserInput {
    email: String!
    name: String!
    age: Int # nullable — 생략 가능
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
`;
