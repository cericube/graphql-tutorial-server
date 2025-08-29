// /src/modules/user/user.service.ts

// Prisma 클라이언트 타입 import (보통 @prisma/client 또는 커스텀 빌드 경로 사용)
import { PrismaClient } from '../../generated/prisma';

// GraphQL 에러를 던지기 위한 표준 객체 (Apollo 서버, Yoga 등에서 사용 가능)
import { GraphQLError } from 'graphql';

// 유효성 검증용 라이브러리 Zod import
import { z } from 'zod';

// 사용자 ID 유효성 검증 스키마 (DTO로 분리된 구조)
import { userIdSchema } from './user.dto';

// Prisma 에러를 GraphQL-friendly하게 처리하는 공통 헬퍼 함수
import { handlePrismaError } from '../../utils/error.helper';

/**
 * 사용자 관련 비즈니스 로직을 담당하는 서비스 클래스
 * GraphQL 리졸버에서는 이 서비스 클래스를 호출하여 DB 작업을 수행합니다.
 */
export class UserService {
  // 의존성 주입 방식으로 PrismaClient를 외부에서 주입받습니다.
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 전체 사용자 목록을 조회하는 메서드
   * - /users 쿼리에서 사용됨
   * - Prisma의 findMany() 메서드 사용
   */
  async getUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      // DB 오류 처리 (예: 연결 오류, 쿼리 구문 오류 등)
      handlePrismaError(error);
    }
  }

  /**
   * 특정 사용자를 ID 기준으로 조회하는 메서드
   * - /user(id: Int!) 쿼리에서 사용됨
   * - 입력 유효성 검증 + 예외처리 + Prisma 쿼리 실행을 포함
   */
  async getUserById(id: number) {
    // Zod를 사용해 입력값 검증 수행
    const result = userIdSchema.safeParse({ id });
    console.log(result); // 디버깅 로그 (실제 서비스에서는 제거 권장)

    if (!result.success) {
      // 유효성 검증 실패 시 GraphQL 표준 예외 반환
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT', // Apollo 서버 표준 에러 코드
          validationErrors: z.flattenError(result.error), // 상세 오류 정보 제공
        },
      });
    }

    try {
      // Prisma를 이용한 단일 조회
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      // 예외 발생 시 공통 에러 핸들러 호출
      handlePrismaError(error);
    }
  }
}

/**
 * Zod의 parse() vs safeParse() 차이 설명
 *
 * 1. zod.parse(data)
 *  - 유효성 검사를 실행하고, 실패하면 예외(Error)를 바로 throw합니다.
 *  - try-catch로 감싸지 않으면 서버가 중단될 수 있습니다.
 *
 *  예:
 *    const parsed = schema.parse({ id: 'abc' });
 *    // 유효하지 않은 입력 시: ZodError 예외가 발생 → 서버 오류 가능
 *
 * 2. zod.safeParse(data)
 *  - 실패 시 예외를 발생시키지 않고, 성공 여부를 result.success로 구분합니다.
 *  - 반환 객체 형식: { success: true, data: T } 또는 { success: false, error: ZodError }
 *  - API 요청 처리 등에서 **에러 핸들링이 안전하고 명확**합니다.
 *
 *  예:
 *    const result = schema.safeParse({ id: 'abc' });
 *    if (!result.success) {
 *      // 검증 실패 → result.error에 오류 정보가 포함됨
 *    }
 *
 * 실무 권장 방식
 *  - API 입력 검증, GraphQL Query/Mutation 파라미터 검증 시에는 `safeParse()`를 사용하는 것이 안전합니다.
 *  - 서버 중단 없이 클라이언트에게 명확한 오류 응답을 주려면 반드시 `safeParse()` → 조건 분기로 처리하세요.
 */
