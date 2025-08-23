// /src/modules/post/category.schema.ts

export const categoryTypeDefs = /* GraphQL */ `
  # 카테고리 타입 정의
  # 이 타입은 게시글(Post)과 다대다(N:M) 관계를 갖는 카테고리(Category)를 나타냅니다.
  # 예: "GraphQL", "Prisma", "DevOps"와 같은 태그나 분류 개념

  type Category {
    # 고유 식별자 - 각 카테고리를 유일하게 구분하기 위한 ID
    id: Int!

    # 카테고리 이름 - 예: "백엔드", "프론트엔드", "인프라"
    name: String!

    # 이 카테고리에 속한 게시글 목록
    # Post와의 N:M 관계를 표현하며, 해당 카테고리를 가진 모든 게시글(Post[])을 반환
    # GraphQL 쿼리에서 category.posts로 접근 가능
    posts: [Post!]!
  }
`;
