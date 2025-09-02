// src/utils/error.helper.ts

import { GraphQLError } from 'graphql';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { logger } from './logger';

/**
 * PrismaClient에서 발생하는 예외를 공통적으로 처리하는 유틸리티 함수
 * @param error - PrismaClient에서 발생한 예외 객체
 * @throws GraphQLError - 클라이언트에 반환할 GraphQL 표준 오류 객체
 */
export function handlePrismaError(error: unknown): never {
  const logString = JSON.stringify(error, null, 2);
  logger.error(logString);
  if (typeof error === 'object' && error?.constructor?.name === 'PrismaClientKnownRequestError') {
    const err = error as PrismaClientKnownRequestError;
    switch (err.code) {
      case 'P2002':
        // Unique 제약조건 위반 (예: email)
        throw new GraphQLError('입력값이 유효하지 않습니다.', {
          extensions: {
            code: 'NOT_FOUND',
            validationErrors: {
              formErrors: ['이미 존재하는 값입니다.'],
              fieldErrors: {},
            },
          },
        });
      case 'P2025':
        // 레코드가 존재하지 않음 (예: where 조건과 일치 리소스 미존재)
        // 통일성을 위해 validationErrors 키를 유지(폼 에러 아님 → formErrors로 메시지 제공)
        throw new GraphQLError('입력값이 유효하지 않습니다.', {
          extensions: {
            code: 'NOT_FOUND',
            validationErrors: {
              formErrors: ['요청한 리소스를 찾을 수 없습니다.'],
              fieldErrors: {},
            },
          },
        });
    }
  }

  // 3) 기타 알 수 없는 내부 오류
  throw new GraphQLError('서버 내부 오류가 발생했습니다.', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      validationErrors: {
        formErrors: ['알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'],
        fieldErrors: {},
      },
    },
  });
}
