import { PrismaClient } from '../../generated/prisma';
import { handlePrismaError } from '../../utils/error.helper';
import { CreateUserInput, UpdateUserInput } from './user.dto';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserById(id: number) {
    // 일치하는 ID가 없을 경우 "에러를 발생시키지 않고 null을 반환합니다.
    // findUnique
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(input: CreateUserInput) {
    try {
      return await this.prisma.user.create({
        data: input,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateUser(id: number, input: UpdateUserInput) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteUser(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
