// ch20/src/schema.ts

export const typeDefs = /* GraphQL */ `
  # custom scalars
  scalar ISODate
  scalar EmailAddress
  scalar URL

  # graphql-scalars
  scalar DateTime2
  scalar EmailAddress2
  scalar URL2

  type Query {
    serverTime: ISODate
    contactEmail: EmailAddress
    homepage: URL
    # 테스트용: 클라이언트가 날짜를 인자로 넘기면 그대로 반환
    echoDate(date: ISODate!): ISODate
    # 테스트용: 이메일 그대로 반환
    echoEmail(email: EmailAddress!): EmailAddress
    # 테스트용: URL 그대로 반환
    echoURL(url: URL!): URL

    # graphql-scalars 테스용 필드
    now: DateTime2
    contact: EmailAddress2
    site: URL2
  }
`;
