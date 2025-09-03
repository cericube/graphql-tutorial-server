// src/modules/user/user.dto.ts
// -------------------------------------------------------------
// Zod 4.1.x 기반 DTO 스키마 (GraphQL 인자 검증).
// - 옵션 객체의 커스텀 에러 키는 `error` 사용.
// - 필요 시 .strict()로 초과 키 차단, .default({})로 인자 미전달 대비.
// -------------------------------------------------------------

import { z } from 'zod';

/** 단일 사용자 조회: id는 양의 정수 */
export const userArgsSchema = z.object({
  id: z.number().int().positive({ error: '유효한 사용자 ID여야 합니다.' }),
  // }).strict()
});

/** 사용자 목록 조회: 페이지네이션 인자 */
export const usersArgsSchema = z.object({
  // optional(): undefined 허용(키 생략 가능), null은 불가
  skip: z.number().int().min(0, { error: '유효한 skip 값이어야 합니다.' }).optional(),
  // nullish(): undefined | null 모두 허용
  take: z.number().int().min(1, { error: '유효한 take 값이어야 합니다.' }).nullish(),
  // }).strict().default({})
});

/** 스키마로부터 타입 추론(스키마-타입 드리프트 방지) */
export type UserArgs = z.infer<typeof userArgsSchema>;
export type UsersArgs = z.infer<typeof usersArgsSchema>;

/* 사용 팁
  - 안전 파싱: const r = userArgsSchema.safeParse(args)
  - 인자 생략 대응: usersArgsSchema.parse(args ?? {})
*/
