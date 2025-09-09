import { GraphQLError } from 'graphql';
import { z, ZodError } from 'zod';

export function throwInputValidationError(zodError: ZodError): never {
  throw new GraphQLError('입력값이 유효하지 않습니다.', {
    extensions: {
      code: 'BAD_USER_INPUT',
      validationErrors: z.flattenError(zodError), // 상세 오류 정보(프로젝트 유틸 기준)
    },
  });
}
