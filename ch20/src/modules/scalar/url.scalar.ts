// ch20/src/modules/scalar/url.scalar.ts

import { GraphQLScalarType, GraphQLError, Kind } from 'graphql';
import { z } from 'zod';

// Zod 스키마 정의: 유효한 절대 URL인지 검증
const urlSchema = z.url();

/**
 * URLScalar
 * - GraphQL에서 사용할 사용자 정의 Scalar 타입 'URL' 정의
 * - 유효한 절대 URL(https://...) 형식만 허용
 * - 클라이언트 → 서버 입력값 검증
 * - 서버 → 클라이언트 응답값 직렬화
 */
export const URLScalar = new GraphQLScalarType({
  name: 'URL',
  description: 'Valid absolute URL (e.g. https://example.com)',

  /**
   * 서버 → 클라이언트 응답 시 호출
   * 예: resolver에서 반환한 값을 클라이언트에 전달할 때
   */
  serialize(value): string {
    // 타입이 문자열이 아니거나, 유효한 URL이 아닐 경우 예외 처리
    if (typeof value !== 'string' || !urlSchema.safeParse(value).success) {
      throw new GraphQLError('URL: Invalid string format during serialization');
    }
    return value;
  },

  /**
   * 클라이언트 → 서버 요청 시, 쿼리 변수로 전달되는 값 처리
   * 예: mutation input 등에서 URL 값을 전달한 경우
   */
  parseValue(value): string {
    const result = urlSchema.safeParse(value);
    if (!result.success) {
      throw new GraphQLError('URL: Invalid input');
    }
    return result.data;
  },

  /**
   * 클라이언트 → 서버 요청 시, 리터럴로 직접 전달된 값 처리
   * 예: 쿼리에서 하드코딩된 값 `homepage(url: "https://...")` 등
   */
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('URL literal must be a string');
    }

    const result = urlSchema.safeParse(ast.value);
    if (!result.success) {
      throw new GraphQLError('URL: Invalid literal');
    }

    return result.data;
  },
});
