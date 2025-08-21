// src/utils/error.helper.ts

import { GraphQLError } from 'graphql';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { logger } from './logger';
/**
 * ✅ 방식 1: GraphQLError 객체를 반환하는 함수
 * 이 함수는 Prisma 예외 객체를 받아서 적절한 GraphQLError 인스턴스를 return 합니다.
 * 즉, 이 함수 자체는 예외를 던지지 않으며,
 * 상위에서 `throw handlePrismaError(err)` 형식으로 사용해야 합니다.
 *
 * ➕ 장점:
 * - 테스트 및 로깅 등 중간 처리 가능
 * - throw 시점을 호출부에서 유연하게 제어 가능
 *
 * ➖ 단점:
 * - 호출부에서 항상 throw를 직접 해야 함
 */
export function handlePrismaError2(error: unknown): GraphQLError {
  const logString = JSON.stringify(error, null, 2);
  logger.error(logString);
  if (typeof error === 'object' && error?.constructor?.name === 'PrismaClientKnownRequestError') {
    const err = error as PrismaClientKnownRequestError;
    switch (err.code) {
      case 'P2002':
        return new GraphQLError('이미 존재하는 이메일입니다.', {
          extensions: { code: 'BAD_REQUEST' },
        });
      case 'P2025':
        return new GraphQLError('요청한 사용자를 찾을 수 없습니다.', {
          extensions: { code: 'NOT_FOUND' },
        });
    }
  }

  return new GraphQLError('서버 내부 오류가 발생했습니다.', {
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  });
}

/**
 * ✅ 방식 2: 함수 내부에서 바로 throw하는 함수
 * 이 함수는 예외 객체를 받아, 내부에서 적절한 GraphQLError를 즉시 throw 합니다.
 * 리턴 타입은 `never`이며, 이는 함수가 정상적으로 값을 반환하지 않고 종료됨을 명시하는 타입입니다.
 *
 * ➕ 장점:
 * - 호출부가 단순해짐 (그냥 `handlePrismaError2(err)`만 호출하면 됨)
 * - 일관된 패턴 유지에 좋음
 *
 * ➖ 단점:
 * - 테스트나 로깅 등의 유연한 제어가 어려움
 * - 항상 예외를 던지므로 사용 흐름에서 주의 필요
 */
export function handlePrismaError(error: unknown): never {
  const logString = JSON.stringify(error, null, 2);
  logger.error(logString);
  if (typeof error === 'object' && error?.constructor?.name === 'PrismaClientKnownRequestError') {
    const err = error as PrismaClientKnownRequestError;
    switch (err.code) {
      case 'P2002':
        throw new GraphQLError('이미 존재하는 이메일입니다.', {
          extensions: { code: 'BAD_REQUEST' },
        });
      case 'P2025':
        throw new GraphQLError('요청한 사용자를 찾을 수 없습니다.', {
          extensions: { code: 'NOT_FOUND' },
        });
    }
  }
  throw new GraphQLError('서버 내부 오류가 발생했습니다.', {
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  });
}
