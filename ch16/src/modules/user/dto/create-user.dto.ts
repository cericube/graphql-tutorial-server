// /src/modules/user/dto/create-user.dto.ts

import { z } from 'zod'; // Zod는 런타임 유효성 검증을 위한 타입 안전한 스키마 선언 라이브러리입니다.

/**
 * 👤 CreateUserSchema
 * 사용자를 생성할 때 전달되는 입력값(input)을 런타임에서 검증하기 위한 Zod 스키마입니다.
 * GraphQL의 input 타입과 1:1로 매칭되며, 실제 서버 로직에서는 이 스키마를 통해
 * 이메일 형식, 이름 길이, 나이 범위 등을 안전하게 검증할 수 있습니다.
 */
export const CreateUserSchema = z.object({
  /**
   * 📧 email
   * 이메일 형식인지 검증합니다.
   * - `z.email()`은 Zod 4에서 새롭게 제공되는 top-level API입니다.
   * - 내부적으로 정규표현식을 통해 RFC 이메일 포맷을 검사합니다.
   * - 잘못된 형식이면 지정한 message를 반환합니다.
   * - 예) "abc@naver" → ❌ "이메일 형식이 올바르지 않습니다."
   */
  email: z.email({
    message: '이메일 형식이 올바르지 않습니다.',
  }),

  /**
   * 🧑 name
   * 이름은 최소 2자 이상이어야 합니다.
   * - `z.string().min(2)`는 문자열이 2자 미만이면 에러를 발생시킵니다.
   * - 실무에서는 사용자가 공백 또는 단일 문자 입력을 방지하는 데 사용됩니다.
   * - 예) "" 또는 "김" → ❌ "이름은 최소 2자 이상이어야 합니다."
   */
  name: z.string().min(2, {
    message: '이름은 최소 2자 이상이어야 합니다.',
  }),

  /**
   * 🎂 age
   * 사용자의 나이를 검증합니다.
   * - `z.number().min(18)`은 18세 미만일 경우 에러 발생
   * - `.optional()`을 붙여서, 클라이언트가 나이를 입력하지 않아도 허용됩니다
   *   → 이 경우 GraphQL SDL에서도 age는 nullable(Int)이어야 일치합니다.
   * - 예) 15 → ❌ "나이는 18세 이상이어야 합니다."
   *       undefined → ✅ 허용
   */
  age: z
    .number()
    .min(18, {
      message: '나이는 18세 이상이어야 합니다.',
    })
    .optional(),
});

/**
 * 🔁 CreateUserInput 타입
 * 위의 CreateUserSchema에서 타입만 추론하여 별도로 선언합니다.
 * - 이 타입은 서비스 계층, 리졸버, 유닛 테스트 등에서 사용됩니다.
 * - Zod 스키마와 GraphQL 타입의 TypeScript 일관성을 유지하는 핵심 포인트입니다.
 */
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
