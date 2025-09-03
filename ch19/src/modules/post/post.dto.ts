// src/modules/post/post.dto.ts
// -------------------------------------------------------------
// DTO + 런타임 검증(Zod) 스키마 정의 파일입니다.
// - 이 파일은 GraphQL 쿼리 인자를 안전하게 파싱·검증하는 역할을 담당합니다.
// - 타입은 Zod 스키마에서 추론(infer)하여 단일 소스 오브 트루스(SSOT)를 유지합니다.
// - GraphQL의 nullable 특성에 맞춰 optional/nullable을 구분해 처리합니다.
// -------------------------------------------------------------

import { z } from 'zod';

/**
 * PostFilterInput 스키마입니다.
 * - titleContains: 공백만 있거나 빈 문자열인 경우 의미가 없으므로 undefined로 정규화합니다.
 * - published: 게시 여부를 Boolean으로 받되, 미지정 시에는 필터에서 제외합니다.
 * - .strict(): 정의되지 않은 키가 들어오면 예외를 발생시켜 API 계약 일관성을 보장합니다.
 */
export const postFilterInputSchema = z
  .object({
    /**
     * GraphQL에서 nullable로 들어올 수 있으므로 optional().nullable()을 함께 사용합니다.
     * - string -> trim -> 빈 문자열이면 undefined로 변환
     * - undefined/null이면 그대로 통과(필터 미적용)
     */
    titleContains: z
      .string()
      .optional()
      .nullable()
      .transform((v) => (typeof v === 'string' ? (v.trim() ? v.trim() : undefined) : v)),

    /**
     * 게시 여부 필터입니다.
     * - 전달되지 않으면 필터에서 제외합니다.
     */
    published: z.boolean().optional().nullable(),
  })
  .strict();

/**
 * 정렬 입력 스키마입니다.
 * - field: 정렬 대상 필드(id | title)
 * - direction: 정렬 방향(asc | desc)
 * - .strict(): 불필요한 필드 유입을 차단합니다.
 */
export const postOrderByInputSchema = z
  .object({
    field: z.enum(['id', 'title']),
    direction: z.enum(['asc', 'desc']),
  })
  .strict();

/**
 * posts 쿼리의 인자 스키마입니다.
 * - filter: 위에서 정의한 필터 스키마를 사용합니다.
 * - skip: 0 이상 정수 (페이지 오프셋)
 * - take: 1 ~ 100 범위의 정수 (페이지 크기, 서비스 정책에 맞게 조정 가능합니다)
 * - orderBy: 정렬 기준
 *
 * 핵심 포인트:
 * - .default({})를 사용하여 args가 아예 전달되지 않아도 안전하게 {}로 대체합니다.
 *   → resolver에서 args가 undefined여도 parse 시 실패하지 않습니다.
 * - .strict()로 유효하지 않은 키를 조기에 차단합니다.
 */
export const postsArgsSchema = z
  .object({
    filter: postFilterInputSchema.optional().nullable(),

    // 페이지네이션 오프셋: 0 이상 정수
    skip: z.number().int().min(0).optional().nullable(),

    // 페이지네이션 크기: 1~100의 합리적 범위를 정책으로 설정
    take: z.number().int().min(1).max(100).optional().nullable(),

    // 정렬 기준: 미전달 시 정렬 미적용
    orderBy: postOrderByInputSchema.optional().nullable(),
  })
  .strict()
  .default({});

/**
 * post(id: Int!) 단일 조회 스키마입니다.
 * - id: 양의 정수만 허용합니다.
 * - .strict()로 불필요한 키 유입을 차단합니다.
 */
export const postArgsSchema = z
  .object({
    id: z.number().int().positive(),
  })
  .strict();

/* ----------------------------------------------------------------
 * Zod 스키마로부터 TypeScript 타입을 추론합니다.
 * - 수동 타입 정의를 없애고, 스키마와 타입의 불일치를 방지합니다.
 * - 외부 모듈에서는 아래 타입을 그대로 사용하면 됩니다.
 * ---------------------------------------------------------------- */
export type PostFilterInput = z.infer<typeof postFilterInputSchema>;
export type PostOrderByInput = z.infer<typeof postOrderByInputSchema>;
export type PostsArgs = z.infer<typeof postsArgsSchema>;
export type PostArgs = z.infer<typeof postArgsSchema>;
