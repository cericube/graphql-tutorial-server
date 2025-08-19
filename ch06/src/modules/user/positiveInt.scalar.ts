import { GraphQLScalarType, Kind } from 'graphql';

/**
 * PositiveInt Scalar
 * - 0보다 큰 정수만 허용하는 GraphQL Scalar 타입
 * - 값이 잘못되면 GraphQL 레벨에서 요청을 거부
 */
export const PositiveInt = new GraphQLScalarType({
  name: 'PositiveInt', // GraphQL에서 사용할 타입 이름
  description: '양수 정수만 허용하는 Scalar 타입',

  // 클라이언트 → 서버 (변수로 전달 시) 값 검증
  parseValue(value) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error('양수 정수만 입력 가능합니다.');
    }
    return value;
  },

  // 서버 → 클라이언트 (응답 시) 직렬화
  serialize(value) {
    return value;
  },

  // 클라이언트 → 서버 (리터럴 값) 값 검증
  parseLiteral(ast) {
    if (ast.kind === Kind.INT && parseInt(ast.value, 10) > 0) {
      return parseInt(ast.value, 10);
    }
    throw new Error('양수 정수만 입력 가능합니다.');
  },
});
