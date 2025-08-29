// /src/modules/user/user.resolver.ts

// GraphQLContext 타입을 불러옵니다.
// 서비스 계층(UserService, PostService 등)에 접근하기 위해 사용됩니다.
import { GraphQLContext } from '../../context';

export const userResolvers = {
  // Query 루트 리졸버 정의
  Query: {
    /**
     * 단일 사용자 조회
     * 예: query { user(id: 1) { id name } }
     */
    user: (_: unknown, args: { id: number }, context: GraphQLContext) => {
      // 컨텍스트에서 주입된 서비스 계층 사용
      return context.services.userService.getUserById(args.id);
    },

    /**
     * 전체 사용자 목록 조회
     * 예: query { users { id name } }
     */
    users: (_: unknown, __: unknown, context: GraphQLContext) => {
      return context.services.userService.getUsers();
    },
  },

  /**
   * 타입 필드 리졸버(Type Field Resolver) - User.posts
   *
   * GraphQL SDL에서 정의된 `type User`의 하위 필드인 `posts`에 대해
   * 데이터 조회 로직을 명시적으로 구현합니다.
   *
   * 해당 리졸버는 `Query.user`, `Query.users` 등에서 반환된
   * User 객체(parent)의 `id`를 기준으로, 이 사용자가 작성한 게시글(Post)을 가져옵니다.
   *
   * GraphQL은 관계형 구조를 자동으로 이해하지 못하기 때문에,
   * 관계형 필드는 명시적인 리졸버가 필요합니다.
   *
   * 핵심: parent.id → Post.authorId 기준으로 1:N 관계 조회
   */
  User: {
    posts: (parent: { id: number }, _: unknown, context: GraphQLContext) => {
      return context.services.postService.getPostsByUserId(parent.id);
    },
  },
};

/**
 * 리졸버 없이도 작동할 수 있지 않나요?
 * Prisma에서 include: { posts: true }로 관계를 한번에 조회할 수 있습니다.
 * 하지만 동적으로 로딩하거나 조건 필터링이 필요한 경우에는 리졸버로 분리하는 것이 유리합니다.
 */
