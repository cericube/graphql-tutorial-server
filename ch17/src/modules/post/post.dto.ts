import { z } from 'zod';

/**
 * 게시글 조회 시 사용할 필터 및 정렬 인자에 대한 유효성 검증 스키마입니다.
 * 클라이언트가 보낸 `filter`, `sort` 인자가 형식과 규칙에 맞는지 Zod로 검증합니다.
 */
export const postFilterSchema = z.object({
  // 🔹 filter: 게시글을 조건 검색할 때 사용되는 필드 집합
  filter: z
    .object({
      // 제목(title): 문자열이며, 최소 1자 이상, 최대 100자 이하
      // 생략 가능 (optional)
      title: z
        .string()
        .min(1, { error: '제목은 최소 1자 이상이어야 합니다.' })
        .max(100, { error: '제목은 100자 이하로 입력해 주세요.' })
        .optional(),

      // 게시 상태(published): Boolean 타입 (true 또는 false)
      // 생략 가능 (optional)
      published: z
        .boolean({
          error: 'published 필드는 true 또는 false만 허용됩니다.',
        })
        .optional(),
    })
    .optional(), // 전체 필터 객체 자체가 생략 가능하므로, 조건 없이 전체 조회도 가능

  // 🔹 sort: 게시글 정렬 기준과 방향을 정의하는 객체
  sort: z
    .object({
      // 정렬 기준 필드: 'title' 또는 'createdAt' 중 하나만 허용
      field: z.enum(['title', 'createdAt'], {
        error: '정렬 기준은 title 또는 createdAt만 가능합니다.',
      }),
      // 정렬 방향: 'asc' 또는 'desc'만 허용
      order: z.enum(['asc', 'desc'], {
        error: '정렬 순서는 asc 또는 desc만 허용됩니다.',
      }),
    })
    .optional(), // 정렬 옵션도 생략 가능
});

/**
 * 위 Zod 스키마로부터 TypeScript 타입을 추론합니다.
 * 해당 타입은 리졸버, 서비스 계층에서 타입 안전하게 사용됩니다.
 */
export type PostFilterInput = z.infer<typeof postFilterSchema>;
