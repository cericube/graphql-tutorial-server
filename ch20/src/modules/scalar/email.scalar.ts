// ch20/src/modules/scalar/email.scalar.ts

// GraphQLScalarType: 커스텀 스칼라 정의용 클래스
// GraphQLError: 검증 실패 시 오류 반환용
// Kind: parseLiteral에서 AST 노드 타입 확인용 상수
import { GraphQLScalarType, GraphQLError, Kind } from 'graphql';

// zod를 사용해 이메일 유효성 검사 스키마 정의
import { z } from 'zod';

// 이메일 형식 스키마 정의 (RFC 5322 기반 검증)
const emailSchema = z.email();

/**
 * EmailAddress Scalar 정의
 * - GraphQL에서 이메일 형식을 명확히 제한하기 위한 커스텀 스칼라
 * - 모든 입력 값은 zod를 통해 유효성 검사됨
 */
export const EmailAddress = new GraphQLScalarType({
  name: 'EmailAddress',
  description: 'RFC 5322-compliant email address',

  /**
   * serialize: 서버 → 클라이언트 응답 시 데이터 직렬화
   * - 서버 내부 값이 클라이언트로 전송되기 전에 실행됨
   * - 타입이 문자열이면서 이메일 형식이 맞는지 확인
   */
  serialize(value): string {
    if (typeof value !== 'string' || !emailSchema.safeParse(value).success) {
      throw new GraphQLError('EmailAddress: Invalid email format (serialize)');
    }
    return value;
  },

  /**
   * parseValue: 클라이언트 → 서버로 넘어오는 변수 값 처리
   * - 클라이언트가 variables를 통해 전송한 이메일 값 검증
   */
  parseValue(value): string {
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      throw new GraphQLError('EmailAddress: Invalid input (parseValue)');
    }
    return result.data;
  },

  /**
   * parseLiteral: 클라이언트 → 서버로 직접 쿼리에 입력된 리터럴 값 처리
   * - 예: { email: "admin@example.com" } 같은 쿼리 리터럴을 직접 파싱
   */
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('EmailAddress literal must be a string');
    }
    const result = emailSchema.safeParse(ast.value);
    if (!result.success) {
      throw new GraphQLError('EmailAddress: Invalid literal');
    }
    return result.data;
  },
});
