// // ch20/src/resolvers.ts
import { DateTimeResolver, EmailAddressResolver, URLResolver } from 'graphql-scalars';

// import { ISODate } from './modules/scalar/iso-date.scalar';
// import { EmailAddress } from './modules/scalar/email.scalar';
// import { URLScalar } from './modules/scalar/url.scalar';

export const resolvers = {
  // // custom scalars
  // ISODate,
  // EmailAddress,
  // URL: URLScalar,

  // graphql-scalars
  DateTime2: DateTimeResolver,
  EmailAddress2: EmailAddressResolver,
  URL2: URLResolver,

  Query: {
    serverTime: () => '2025-08-28', //new Date(),
    contactEmail: () => 'admin@example.com',
    homepage: () => 'https://graphql.example.com',
    echoDate: (_: unknown, args: { date: Date }) => args.date,
    echoEmail: (_: unknown, args: { email: string }) => args.email,
    echoURL: (_: unknown, args: { url: string }) => args.url,
    // graphql-scalars 테스트용 필드
    now: () => new Date().toISOString(),
    contact: () => 'support@example2.com',
    site: () => 'https://graphql.example2.com',
  },
};
