// /src/modules/post/post.resolver.ts

import { GraphQLContext } from '../../context';
import { PostsArgs } from './post.dto';

/**
 * 게시글(Post) 관련 GraphQL 리졸버 정의
 *
 * 이 객체는 GraphQL 서버에서 게시글 데이터를 조회하거나,
 * Post 타입의 하위 필드를 개별적으로 처리할 때 사용됩니다.
 *
 * 구조:
 * - Query 루트 리졸버: posts (게시글 목록 조회)
 * - Post 타입 리졸버: author (게시글 작성자 조회)
 *
 * 특징:
 * - 서비스 계층(PostService, UserService)와 연결되어 있어,
 *   데이터베이스 접근 및 비즈니스 로직을 분리된 계층에서 처리합니다.
 */
export const postResolvers = {
  // -------------------------------------------------
  // 1) 루트 쿼리 리졸버 정의
  // -------------------------------------------------
  Query: {
    /**
     * 게시글 목록 조회 (posts)
     *
     * 클라이언트가 다음과 같이 쿼리를 요청하면 실행됩니다:
     *
     * query {
     *   posts(filter: { title: "GraphQL" }, sort: { field: createdAt, order: desc }) {
     *     id
     *     title
     *   }
     * }
     *
     * 동작 흐름:
     * 1. 클라이언트로부터 전달된 인자(args)를 구조분해 → filter, sort 조건 추출
     * 2. 서비스 계층(PostService)의 getFilteredPosts 메서드를 호출하여 실제 데이터 조회
     *    - Prisma ORM을 통해 DB 접근
     *    - filter 조건(title, published 여부 등)과 정렬 옵션(field, order 등)을 반영
     * 3. 최종적으로 Post 객체 배열 반환
     *
     * @param _ GraphQL의 첫 번째 인자(root) – 여기서는 사용하지 않으므로 `_` 처리
     * @param args 클라이언트가 전달한 필터/정렬 조건 (PostsArgs DTO 참조)
     * @param context GraphQLContext – 서비스 계층(PostService)에 접근하기 위해 사용
     * @returns 조건에 맞는 Post[] 배열
     */
    posts: (_: unknown, args: PostsArgs, context: GraphQLContext) => {
      return context.services.postService.getFilteredPosts(args);
    },
  },

  // -------------------------------------------------
  // 2) 타입 리졸버 정의 (Post 내부 필드 전용)
  // -------------------------------------------------
  Post: {
    /**
     * Post.author 리졸버
     *
     * 클라이언트가 게시글과 함께 작성자(author) 정보를 요청할 때 실행됩니다:
     *
     * query {
     *   posts {
     *     title
     *     author {
     *       name
     *     }
     *   }
     * }
     *
     * 동작 흐름:
     * 1. parent 객체로부터 authorId(작성자 ID) 추출
     *    - parent는 현재 처리 중인 개별 Post 객체
     * 2. UserService의 getUserById(authorId) 호출
     *    - DB에서 해당 ID를 가진 User 데이터 조회
     * 3. User 객체 반환 → GraphQL 스키마의 User 타입과 매핑
     *
     * @param parent 상위(Post) 객체 – GraphQL이 리졸버 체인을 통해 전달
     * @param parent.authorId 게시글 작성자의 ID (DB 외래키 역할)
     * @param _ 두 번째 인자(args) – 이 필드 리졸버에서는 사용하지 않음
     * @param context GraphQLContext – UserService 접근에 사용
     * @returns User 객체 (authorId에 해당하는 사용자 정보)
     */
    author: (parent: { authorId: number }, _: unknown, context: GraphQLContext) => {
      return context.services.userService.getUserById(parent.authorId);
    },
  },
};
