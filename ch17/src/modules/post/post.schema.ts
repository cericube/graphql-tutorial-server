/**
 * 게시글(Post) 관련 GraphQL 스키마 정의 (SDL: Schema Definition Language)
 *
 * 이 스키마는 클라이언트가 요청 가능한 게시글 데이터의 구조, 입력 타입, 쿼리 형식을 선언합니다.
 * GraphQL 서버는 이 정의에 따라 유효한 요청인지 검사하고, 응답 타입을 보장합니다.
 *
 * 구성 요소 설명:
 * -----------------------------------------------------
 * - type Post
 *   : 게시글(Post)의 데이터 구조를 정의하는 GraphQL 객체 타입입니다.
 *     Prisma의 Post 모델과 매핑되며, 클라이언트에서 조회 가능한 필드들을 포함합니다.
 *
 * - input PostFilterInput
 *   : 게시글을 필터링할 때 사용하는 조건 입력값 구조입니다.
 *     예: 제목 키워드 포함, 공개 여부(published) 등
 *
 * - enum SortOrder
 *   : 정렬 순서를 정의하는 열거형 타입입니다.
 *     오름차순(asc) 또는 내림차순(desc)만 허용됩니다.
 *
 * - input PostSortInput
 *   : 정렬 기준(field)과 정렬 순서(order)를 함께 정의하는 입력 타입입니다.
 *
 * - type Query
 *   : 루트 쿼리 타입으로, 게시글 목록을 조회하는 posts 필드를 포함합니다.
 *     filter, sort 인자를 통해 유연한 조건 검색이 가능합니다.
 */
export const postTypeDefs = /* GraphQL */ `
  # 게시글 데이터 구조 정의
  type Post {
    id: Int!
    title: String!
    content: String!
    published: Boolean!
    createdAt: DateTime!
    author: User! # 게시글 작성자 (User와의 관계형 필드)
  }

  # 게시글 필터링 조건 입력 타입
  input PostFilterInput {
    title: String # 제목에 포함된 문자열로 필터링
    published: Boolean # 공개 여부로 필터링
  }

  # 정렬 순서 열거형 타입
  enum SortOrder {
    asc # 오름차순
    desc # 내림차순
  }

  # 정렬 기준 및 방향을 함께 입력받는 타입
  input PostSortInput {
    field: String! # 정렬 기준 필드: "title" 또는 "createdAt" 등
    order: SortOrder! # 정렬 방향: asc / desc
  }

  # 게시글 목록 조회 쿼리
  type Query {
    posts(
      filter: PostFilterInput # 조건 검색 필드
      sort: PostSortInput # 정렬 옵션
    ): [Post!]! # 게시글 배열 반환 (non-null)
  }
`;
