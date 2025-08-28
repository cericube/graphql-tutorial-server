// /src/modules/user/user.service.ts

// PrismaClient: Prisma ORM으로 DB에 접근하기 위한 클라이언트
import { PrismaClient } from '../../generated/prisma';
// GraphQL 표준 오류 객체. Apollo Server, Yoga 등에서 클라이언트로 에러를 전달할 때 사용됨
import { GraphQLError } from 'graphql';

// Prisma 예외를 공통적으로 처리하는 유틸리티 함수
import { handlePrismaError } from '../../utils/error.helper';

// 사용자 생성 시 입력값 검증을 위한 DTO와 Zod 스키마
import { CreateUserInput, CreateUserSchema } from './dto/create-user.dto';
// zod의 에러 유틸 함수
import { z } from 'zod';

export class UserService {
  // PrismaClient를 의존성으로 주입받음
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 사용자 생성 메서드
   * @param input - 클라이언트에서 전달한 사용자 입력값 (CreateUserInput 타입)
   * @returns 생성된 사용자 객체
   */
  async createUser(input: CreateUserInput) {
    // 1. Zod 스키마 기반 유효성 검사 수행
    const result = CreateUserSchema.safeParse(input);

    // 2. 입력값이 유효하지 않을 경우 GraphQLError를 발생시켜 클라이언트에 반환
    //    GraphQL 에러 확장 필드에 validationErrors를 추가해 상세한 검증 에러 메시지 전달
    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT', // GraphQL 표준 에러 코드 중 하나 (Apollo 권장)
          validationErrors: z.flattenError(result.error), // 각 필드별 검증 실패 이유
        },
      });
    }

    try {
      // 3. 입력값이 유효한 경우 Prisma ORM을 통해 user 테이블에 신규 레코드 삽입
      //    result.data에는 검증이 통과한 안전한 데이터만 존재
      const user = await this.prisma.user.create({
        data: result.data,
      });

      // 4. 성공적으로 생성된 사용자 객체 반환
      return user;
    } catch (error) {
      // 5. Prisma에서 발생하는 에러를 별도의 핸들러로 위임
      //    예: Unique 제약 조건 위반(중복 이메일), DB 연결 오류 등
      handlePrismaError(error);
    }
  }
}
