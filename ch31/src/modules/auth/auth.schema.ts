// /src/modules/user/user.schema.ts

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: Int!
    email: String!
    name: String
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Query {
    isAuthenticated: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!, name: String): User!
    refreshToken(token: String!): AuthPayload!
    changePassword(useroldPassword: String!, newPassword: String!): Boolean!
    logout: Boolean!
  }
`;
