// ch20/src/modules/scalar/iso-date.scalar.ts

// GraphQL 기본 타입 도구와 에러 타입을 불러옵니다.
import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';

// date-fns의 parseISO: 문자열 → Date 객체 변환
// isValid: 유효한 날짜인지 확인
import { parseISO, isValid } from 'date-fns';

// ISODate Scalar 정의
export const ISODate = new GraphQLScalarType({
  name: 'ISODate',
  description: 'ISO 8601 formatted date string (e.g. 2025-08-28T14:30:00Z)',

  /**
   * serialize: 서버 → 클라이언트 응답 직렬화
   * 내부의 Date 객체를 ISO 8601 문자열로 변환
   */
  serialize(value): string {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      // Date 타입이 아니거나 유효하지 않은 날짜일 경우 에러 반환
      throw new GraphQLError('ISODate: Invalid Date object');
    }
    return value.toISOString(); // → ISO 문자열 반환
  },

  /**
   * parseValue: 클라이언트 → 서버로 변수 형태 전달될 때 실행
   * 클라이언트가 전달한 string 값을 Date 객체로 파싱
   */
  parseValue(value): Date {
    if (typeof value !== 'string') {
      throw new GraphQLError('ISODate must be a string');
    }
    const parsed = parseISO(value); // 문자열 → Date 변환
    if (!isValid(parsed)) {
      throw new GraphQLError('Invalid ISO 8601 date string');
    }
    return parsed; // 유효한 Date 객체 반환
  },

  /**
   * parseLiteral: 쿼리 내부에 하드코딩된 리터럴 처리
   * 예: query { getDate(date: "2025-08-28T14:00:00Z") }
   */
  parseLiteral(ast): Date {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('ISODate literal must be a string');
    }
    const parsed = parseISO(ast.value); // AST 값 → Date 변환
    if (!isValid(parsed)) {
      throw new GraphQLError('Invalid ISO 8601 date literal');
    }
    return parsed;
  },
});
