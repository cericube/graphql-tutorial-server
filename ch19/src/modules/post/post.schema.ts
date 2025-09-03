// /src/modules/post/post.schema.ts
// 간단 주석: Post 타입과 목록/단일 조회 쿼리, 필터/정렬 입력 정의입니다.

export const postTypeDefs = /* GraphQL */ `
  # 게시글 엔티티 타입
  type Post {
    id: Int!
    title: String!
    content: String!
    published: Boolean!
    authorId: Int! # 작성자(User) FK
    author: User! # 관계 필드(요청 시 DataLoader로 조회)
  }

  # 정렬 방향
  enum SortOrder {
    asc
    desc
  }

  # 정렬 대상 필드
  enum PostOrderField {
    id
    title
  }

  # 목록 조회용 필터
  input PostFilterInput {
    titleContains: String # 제목 부분 일치
    published: Boolean # 발행 여부
  }

  # 목록 정렬 기준
  input PostOrderByInput {
    field: PostOrderField!
    direction: SortOrder!
  }

  # 단일/목록 조회 쿼리
  type Query {
    post(id: Int!): Post
    posts(
      filter: PostFilterInput
      skip: Int # 페이지 오프셋
      take: Int # 페이지 크기
      orderBy: PostOrderByInput
    ): [Post!]!
  }
`;
