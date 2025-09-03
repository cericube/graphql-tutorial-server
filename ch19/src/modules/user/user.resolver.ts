// /src/modules/user.resolver.ts
// -----------------------------------------------------------------------------
// User 리졸버 모음입니다.
// - GraphQL Yoga v5 컨텍스트(GraphQLContext)를 통해 서비스 계층에 접근합니다.
// - "resolvers = { Query: {...}, User: {...} }" 형태로 타입별 필드 리졸버를 분리합니다.
// -----------------------------------------------------------------------------

import { GraphQLContext } from '../../context';

export const userResolvers = {
  Query: {
    /**
     * user(id: Int!): User
     * - 단일 사용자 조회.
     * - 존재하지 않으면 null을 반환합니다(현 정책). 필요 시 서비스에서 GraphQLError로 변환 가능합니다.
     */
    user: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      // 주의: 런타임 검증이 필요하면 zod(parseUserArgs)로 args를 먼저 검증하십시오.
      return context.services.userService.findById(args.id);
    },

    /**
     * users(skip: Int, take: Int): [User!]!
     * - 사용자 목록 조회(페이지네이션).
     * - 현재 시그니처는 skip/take를 "필수"로 받도록 타입이 선언되어 있습니다.
     *   → 인자 미전달 호출(users())도 허용하려면 { skip?: number; take?: number } 또는 zod .default({})를 사용하세요.
     */
    users: async (
      _parent: unknown,
      args: { skip: number; take: number },
      context: GraphQLContext
    ) => {
      // 필요 시 zod(parseUsersArgs)로 안전 파싱 후 서비스에 전달하세요.
      return context.services.userService.findMany(args);
    },
  },

  User: {
    /**
     * User.posts: [Post!]!
     * - 특정 사용자의 게시글 목록을 반환합니다.
     * - 본 실습에서는 의도적으로 DataLoader를 적용하지 않아,
     *   "users { posts { ... } }" 형태에서 N+1 쿼리 발생을 관찰할 수 있습니다.
     *   (작성자 역참조(Post.author)는 DataLoader로 최적화하는 편을 권장합니다.)
     */
    posts: async (parent: { id: number }, _args: unknown, context: GraphQLContext) => {
      return context.services.postService.findPostsByUserId(parent.id);
    },
  },
};
