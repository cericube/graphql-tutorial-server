import { GraphQLContext } from '../../context';
import { PostFilterInput } from './post.dto';

/**
 * 게시글(Post) 관련 GraphQL 리졸버 정의 객체입니다.
 * - Query 루트 쿼리(posts)와
 * - Post 타입 내부의 필드(author)에 대한 개별 리졸버를 포함합니다.
 */
export const postResolvers = {
  // Query 루트 리졸버 정의
  Query: {
    /**
     * 게시글 목록 조회 리졸버
     *
     * 클라이언트가 GraphQL 쿼리로 posts(filter, sort)를 요청하면 실행됩니다.
     * 전달받은 필터 및 정렬 인자를 서비스 계층(PostService)로 넘겨 실제 데이터 조회를 수행합니다.
     *
     * 예시 쿼리:
     * query {
     *   posts(filter: { title: "GraphQL" }, sort: { field: createdAt, order: desc }) {
     *     id
     *     title
     *   }
     * }
     *
     * @param args.filter 게시글 필터링 조건 (title, published 등)
     * @param args.sort 게시글 정렬 조건 (field, order)
     * @param context GraphQL 컨텍스트 객체 – PostService 접근에 사용
     */
    posts: (
      _: unknown,
      args: {
        filter?: PostFilterInput['filter'];
        sort?: PostFilterInput['sort'];
      },
      context: GraphQLContext
    ) => {
      return context.services.postService.getFilteredPosts(args);
    },
  },

  // 타입 리졸버 – Post.author
  /**
   * Post 타입의 필드 리졸버
   *
   * GraphQL 쿼리에서 Post 타입 내부의 author 필드를 요청할 때 이 리졸버가 실행됩니다.
   *
   * 예시 쿼리:
   * query {
   *   posts {
   *     title
   *     author {
   *       name
   *     }
   *   }
   * }
   *
   * @param parent 부모 객체 – 개별 게시글(Post) 객체
   * @param parent.authorId 게시글의 작성자 ID
   * @returns 해당 authorId에 해당하는 User 객체
   */
  Post: {
    author: (parent: { authorId: number }, _: unknown, context: GraphQLContext) => {
      return context.services.userService.getUserById(parent.authorId);
    },
  },
};
