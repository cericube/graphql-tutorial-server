// /src/modules/post/post.dto.ts

import { z } from 'zod';

/**
 * 🔹 게시글 필터링에 사용될 타입 정의
 *
 * - GraphQL 쿼리에서 전달되는 filter 인자를 타입으로 표현
 * - Prisma where 조건과 유사하게 `AND`, `OR`, `NOT` 조합 가능
 */
export type PostFilterInput = {
  title?: string; // 제목 조건 (부분 일치 검색 등에 활용)
  published?: boolean; // 게시 여부 (true: 발행됨, false: 초안)
  AND?: PostFilterInput[]; // 조건을 모두 만족해야 하는 경우
  OR?: PostFilterInput[]; // 조건 중 하나라도 만족하는 경우
  NOT?: PostFilterInput[]; // 조건을 만족하지 않아야 하는 경우
};

/**
 * 🔹 Zod 스키마: PostFilterInput에 대한 유효성 검사 정의
 *
 * - z.lazy() : 자기 자신을 참조(재귀)할 수 있도록 지연 평가
 * - Prisma의 where 조건식 구조를 그대로 GraphQL 필터로 확장한 형태
 */
const PostFilter: z.ZodType<PostFilterInput> = z.lazy(() =>
  z.object({
    // 제목 조건
    title: z
      .string()
      .min(1, { error: '제목은 최소 1자 이상이어야 합니다.' })
      .max(100, { error: '제목은 100자 이하로 입력해 주세요.' })
      .optional(),

    // 게시 여부 (boolean 값만 허용)
    published: z
      .boolean({
        error: 'published 필드는 true 또는 false만 허용됩니다.',
      })
      .optional(),

    // 논리 연산자 조건
    AND: z.array(PostFilter).optional(), // [조건1, 조건2] → 조건1 AND 조건2
    OR: z.array(PostFilter).optional(), // [조건1, 조건2] → 조건1 OR 조건2
    NOT: z.array(PostFilter).optional(), // [조건1, 조건2] → 조건1 NOT 조건2
  })
);

/**
 * 🔹 게시글 조회 시 사용할 필터 및 정렬 인자에 대한 최상위 스키마
 *
 * 클라이언트가 보낸 GraphQL Query의 `filter`, `sort` 인자가
 * 형식과 규칙에 맞는지 Zod로 검증합니다.
 */
export const postFilterSchema = z.object({
  // 🔸 filter: 게시글 조건 검색용 필드 집합
  // - 생략 가능 (조건 없을 경우 전체 게시글 조회)
  filter: PostFilter.optional(),

  // 🔸 sort: 정렬 옵션
  // - 특정 필드를 기준으로 정렬 수행
  sort: z
    .object({
      // 정렬 기준 필드 (허용 값: title | createdAt)
      field: z.enum(['title', 'createdAt'], {
        error: '정렬 기준은 title 또는 createdAt만 가능합니다.',
      }),

      // 정렬 방향 (허용 값: asc | desc)
      order: z.enum(['asc', 'desc'], {
        error: '정렬 순서는 asc 또는 desc만 허용됩니다.',
      }),
    })
    .optional(), // 정렬 옵션 또한 생략 가능 (기본값은 createdAt desc 같은 정책을 서비스 계층에서 적용 가능)
});

/**
 * 🔹 타입 추론
 *
 * postFilterSchema 스키마를 기반으로 TypeScript 타입을 추론하여
 * 리졸버 및 서비스 계층에서 타입 안전하게 사용합니다.
 *
 * → GraphQL Args에 해당하는 타입
 * 예시: { filter: { title: "GraphQL", published: true }, sort: { field: "createdAt", order: "desc" } }
 */
export type PostsArgs = z.infer<typeof postFilterSchema>;
