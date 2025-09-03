// /src/modules/user.service.ts
// -----------------------------------------------------------------------------
// UserService
// - User 도메인 비즈니스 로직을 담당합니다.
// - 리졸버에서 이 서비스를 호출하여 Prisma ORM과 상호작용합니다.
// - Zod 4.x 스키마로 인자 검증을 수행하고, GraphQLError(BAD_USER_INPUT/NOT_FOUND) 포맷을 일관되게 반환합니다.
// -----------------------------------------------------------------------------

import { PrismaClient } from '../../generated/prisma';
import { GraphQLError } from 'graphql';

import { z } from 'zod';
import { userArgsSchema, usersArgsSchema, UsersArgs } from './user.dto';
import { handlePrismaError } from '../../utils/error.helper';

export class UserService {
  // PrismaClient 주입(테스트/모킹 용이)
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 단일 사용자 조회
   * - 입력 id를 Zod로 검증합니다(양의 정수).
   * - 존재하지 않으면 NOT_FOUND 에러를 던집니다.
   */
  async findById(id: number) {
    const result = userArgsSchema.safeParse({ id });
    if (!result.success) {
      // 유효성 위반 → BAD_USER_INPUT로 변환
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: z.flattenError(result.error), // 상세 오류 정보(프로젝트 유틸 기준)
        },
      });
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        // 도메인 규칙: 조회 결과 없음 → NOT_FOUND
        throw new GraphQLError('사용자를 찾을 수 없습니다.', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return user;
    } catch (error) {
      // GraphQLError는 그대로 전파
      if (error instanceof GraphQLError) {
        throw error;
      }
      // Prisma 예외 공통 처리(로깅/코드 매핑 등)
      handlePrismaError(error);
    }
  }

  /**
   * 다건 조회(배치) – DataLoader에서 사용
   * - ids를 IN 조건으로 한 번에 조회합니다.
   */
  async findUsersByIds(ids: number[]) {
    try {
      return await this.prisma.user.findMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * 사용자 목록 조회
   * - skip/take 페이지네이션 인자를 Zod로 검증합니다.
   * - 전달되지 않은 인자는 undefined로 넘겨 Prisma가 무시하도록 처리합니다.
   */
  async findMany(args: UsersArgs) {
    const result = usersArgsSchema.safeParse(args);
    if (!result.success) {
      // 유효성 위반 → BAD_USER_INPUT로 변환
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: z.flattenError(result.error), // 상세 오류 정보(프로젝트 유틸 기준)
        },
      });
    }

    try {
      // undefined로 넘기면 Prisma가 옵션을 무시합니다.
      const { skip = undefined, take = undefined } = args ?? {};
      return this.prisma.user.findMany({ skip: skip ?? undefined, take: take ?? undefined });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
