// /src/modules/user/user.service.ts

// PrismaClient를 import하여 데이터베이스와 상호작용합니다.
// PrismaClient는 Prisma ORM이 생성한 데이터베이스 클라이언트입니다.
import { PrismaClient } from '../../generated/prisma';
// handlePrismaError 함수를 import하여 Prisma 관련 에러를
// 사용자 친화적인 에러 메시지로 변환하고 처리합니다.
import { handlePrismaError } from '../../utils/error.helper';

import { CreateUserInput } from './user.types';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(input: CreateUserInput) {
    try {
      const user = this.prisma.user.create({
        data: input,
      });
      return user;
    } catch (err) {
      // Prisma에서 발생할 수 있는 데이터베이스 관련 에러를 처리합니다.
      throw handlePrismaError(err);
    }
  }
}
