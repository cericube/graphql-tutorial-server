// src/modules/post/post.types.ts

/**
 * CategoryInput
 * - 클라이언트가 게시글 생성 시 함께 전달하는 카테고리 입력 타입입니다.
 * - 해당 카테고리는 Prisma에서 connectOrCreate 방식으로 처리되며,
 *   이미 존재하는 카테고리라면 연결(connect), 없으면 새로 생성(create)됩니다.
 */
export interface CategoryInput {
  /**
   * name
   * - 카테고리의 이름 (예: "GraphQL", "백엔드")
   * - Prisma 모델의 Category.name 필드와 매핑되며,
   *   해당 필드는 반드시 @unique로 설정되어 있어야 connectOrCreate가 작동합니다.
   */
  name: string;
}

/**
 * CreatePostInput
 * - 게시글(Post)을 생성할 때 클라이언트로부터 받는 입력 타입입니다.
 * - GraphQL의 InputObject 타입과 1:1 매핑되는 구조로, 스키마와 타입 안전성을 유지합니다.
 */
export interface CreatePostInput {
  /**
   * title
   * - 게시글의 제목 (예: "Prisma와 GraphQL의 Nested Mutation 실습")
   */
  title: string;

  /**
   * userId (optional)
   * - 게시글을 작성한 유저의 고유 ID
   * - 해당 ID가 존재할 경우, Prisma에서 connect 방식으로 기존 유저와 관계를 연결합니다.
   * - optional 처리된 이유: 게시글 생성 시 새로운 유저를 create하거나
   *   connectOrCreate 방식을 사용할 수도 있기 때문입니다.
   */
  userId?: number;

  /**
   * categories
   * - 게시글이 속할 카테고리 목록 (N:M 관계)
   * - 각 항목은 CategoryInput 형태이며,
   *   Prisma에서는 connectOrCreate로 처리되어 중복 없이 안전하게 연결됩니다.
   */
  categories: CategoryInput[];
}
