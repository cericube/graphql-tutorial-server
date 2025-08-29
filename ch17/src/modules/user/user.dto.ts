// /src/modules/user/user.dto.ts

// Zod는 런타임 유효성 검증을 위한 타입 안전(schema-based)의 JavaScript 라이브러리입니다.
// GraphQL, REST API에서 클라이언트로부터 받은 입력값을 안전하게 검증하는 데 널리 사용됩니다.
import { z } from 'zod';

/**
 * userIdSchema: 단일 사용자 조회 시 사용하는 ID 파라미터 검증 스키마
 *
 * GraphQL Query.user(id: Int!) 또는 REST /users/:id 와 같이
 * 사용자 ID를 기반으로 특정 유저를 조회할 때, 해당 `id` 값이
 * 반드시 "양의 정수"여야 한다는 제약을 설정합니다.
 *
 * 이 DTO는 서비스 계층(user.service.ts)에서 `safeParse()`를 통해 검증되며,
 * 실패 시 GraphQL 에러로 클라이언트에 의미 있는 피드백을 줄 수 있습니다.
 */
export const userIdSchema = z.object({
  // 🔹 id는 정수(int)이며 0보다 커야 합니다.
  // 🔹 에러 발생 시 사용자에게 보여줄 메시지를 명시적으로 설정할 수 있습니다.
  id: z.number().int().positive({
    error: '유효한 사용자 ID여야 합니다.', // 검증 실패 시 반환할 커스텀 메시지
  }),
});
