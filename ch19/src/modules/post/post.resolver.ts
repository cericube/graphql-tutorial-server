// src/modules/post/post.resolver.ts
// -----------------------------------------------------------------------------
// Post 도메인 리졸버 모음입니다.
// - GraphQL Yoga v5의 context(GraphQLContext)를 통해 서비스 계층과 DataLoader에 접근합니다.
// - "resolvers = { Query: {...}, Post: {...} }" 형태로 타입별 필드 리졸버를 분리합니다.
// - 단일 조회(post)와 목록 조회(posts), 그리고 Post.author 필드를 담당합니다.
// -----------------------------------------------------------------------------

import { GraphQLContext } from '../../context';
import { PostsArgs } from './post.dto';

export const postResolvers = {
  Query: {
    /**
     * post(id: Int!): Post
     * - 단일 게시글을 ID로 조회합니다.
     * - 서비스 계층(PostService)을 통해 Prisma에 접근합니다.
     * - 존재하지 않는 경우 null을 반환합니다(현 정책). 필요 시 GraphQLError로 에러 처리도 가능합니다.
     */
    post: (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      // 주의: args.id는 SDL에서 Int! 이므로 런타임에는 무조건 값이 들어온다고 가정합니다.
      // 검증을 강화하려면 Zod(postArgsSchema)로 추가 검증을 수행할 수 있습니다.
      return context.services.postService.findById(args.id);
    },

    /**
     * posts(input: PostsArgsInput): [Post!]!
     * - 게시글 목록을 필터/정렬/페이지네이션과 함께 조회합니다.
     * - SDL이 input 래퍼를 사용하므로 args.input이 undefined일 수 있습니다.
     *   → 서비스/리졸버 단에서 안전 기본값 처리 또는 Zod 파싱을 권장합니다.
     *
     * 예) Zod 사용 시:
     *   import { parsePostsArgs } from './post.dto';
     *   const safe = parsePostsArgs(args?.input);
     *   return context.services.postService.findMany(safe);
     */
    posts: (_parent: unknown, args: { input: PostsArgs }, context: GraphQLContext) => {
      // 현재 코드는 args.input을 그대로 서비스로 전달합니다.
      // args.input이 전달되지 않은 호출에도 대응하려면, 서비스에서 기본값 처리(findMany(args ?? {}))를 하거나,
      // 여기서 args?.input ?? {}로 보정하여 넘기는 방식을 사용하십시오.
      return context.services.postService.findMany(args.input);
    },
  },

  Post: {
    /**
     * Post.author: User!
     * - 게시글의 작성자(User)를 조회합니다.
     * - N+1 문제를 방지하기 위해 요청 스코프 DataLoader(userById)를 사용합니다.
     *   · 여러 Post의 authorId를 한 틱 안에서 모아 "WHERE id IN (...)" 단일 쿼리로 배치 조회합니다.
     *   · 동일 키는 요청 범위 캐시에 의해 재조회하지 않습니다.
     *
     * 주의:
     * - context.loaders는 createContext()에서 요청마다 생성되어야 합니다(글로벌 싱글턴 금지).
     * - 여기서는 ?. (optional chaining)으로 방어 코드를 두었지만,
     *   프로덕션에서는 로더가 없으면 바로 오류를 내도록(!) 설정하여 구성 누락을 조기에 발견하는 것이 보통 더 안전합니다.
     */
    // author: (parent: { authorId: number }, _args: unknown, context: GraphQLContext) => {
    //   // DataLoader 미사용(직접 서비스 호출) 버전: N+1 위험
    //   return context.services.userService.findById(parent.authorId);
    // },

    author: async (parent: { authorId: number }, _args: unknown, context: GraphQLContext) => {
      // DataLoader 사용 버전: 배치 + 캐시로 N+1 제거
      // - 여러 Post.author 요청이 모이면 userById 로더가 id 배열을 모아 한 번에 조회합니다.
      // - parent.authorId는 Post 테이블의 외래키(authorId)입니다.
      return context.loaders?.userById.load(parent.authorId);
    },
  },
};
