// /src/modules/user/user.service.ts

// PrismaClient를 import하여 데이터베이스와 상호작용합니다.
// PrismaClient는 Prisma ORM이 생성한 데이터베이스 클라이언트입니다.
import { PrismaClient } from '../../generated/prisma';

// CreateUserInput과 UpdateUserInput 타입 정의를 가져와서
// 함수 인자의 타입 안전성을 보장합니다.
import { CreateUserInput, UpdateUserInput } from './user.types';

// handlePrismaError 함수를 import하여 Prisma 관련 에러를
// 사용자 친화적인 에러 메시지로 변환하고 처리합니다.
import { handlePrismaError } from '../../utils/error.helper';

// UserService 클래스는 비즈니스 로직을 담는 서비스 레이어입니다.
// GraphQL 리졸버와 데이터베이스(Prisma) 사이의 중개자 역할을 합니다.
export class UserService {
  // 생성자(constructor)는 클래스 인스턴스가 생성될 때 호출됩니다.
  // private readonly prisma: PrismaClient는 의존성 주입(Dependency Injection) 패턴을 사용하여
  // 외부에서 PrismaClient 인스턴스를 받아와 클래스 내부에서만 사용하도록 합니다.
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * @description 새로운 사용자를 생성하는 비동기 메서드입니다.
   * @param input CreateUserInput 타입의 객체로, 생성할 사용자의 데이터(email, name, age)를 포함합니다.
   * @returns 생성된 사용자 객체를 반환합니다.
   */
  async createUser(input: CreateUserInput) {
    try {
      // prisma.user.create() 메서드를 호출하여 데이터베이스에 새로운 사용자를 생성합니다.
      // data: input은 전달받은 입력 데이터를 그대로 사용하여 레코드를 만듭니다.
      const user = await this.prisma.user.create({
        data: input,
      });
      // 생성된 사용자 객체를 반환합니다.
      return user;
    } catch (err) {
      // Prisma에서 발생할 수 있는 데이터베이스 관련 에러(예: 고유값 중복)를
      // handlePrismaError 함수를 통해 처리하고 사용자 정의 에러로 변환하여 던집니다.
      throw handlePrismaError(err);
    }
  }

  /**
   * @description 기존 사용자의 정보를 업데이트하는 비동기 메서드입니다.
   * @param id 업데이트할 사용자의 고유 식별자(ID)입니다.
   * @param input UpdateUserInput 타입의 객체로, 업데이트할 데이터를 포함합니다.
   * @returns 업데이트된 사용자 객체를 반환합니다.
   */
  async updateUser(id: number, input: UpdateUserInput) {
    try {
      // prisma.user.update() 메서드를 호출하여 특정 사용자를 찾아서 업데이트합니다.
      // where: { id }는 업데이트할 레코드를 찾기 위한 조건을 지정합니다.
      // data: input은 업데이트할 필드와 값을 지정합니다.
      const user = await this.prisma.user.update({
        where: { id },
        data: input,
      });
      // 업데이트된 사용자 객체를 반환합니다.
      return user;
    } catch (err) {
      // 'id'에 해당하는 사용자가 없을 경우 등 Prisma 관련 에러를 처리합니다.
      throw handlePrismaError(err);
    }
  }

  /**
   * @description 사용자를 삭제하는 비동기 메서드입니다.
   * @param id 삭제할 사용자의 고유 식별자(ID)입니다.
   * @returns 성공 여부와 메시지를 담은 객체를 반환합니다.
   */
  async deleteUser(id: number) {
    try {
      // prisma.user.delete() 메서드를 호출하여 특정 사용자를 삭제합니다.
      // where: { id }는 삭제할 레코드를 찾기 위한 조건을 지정합니다.
      await this.prisma.user.delete({
        where: { id },
      });
      // 성공적으로 삭제되면 성공 메시지가 담긴 객체를 반환합니다.
      return {
        success: true,
        message: `User ${id} deleted.`,
      };
    } catch (err) {
      // 'id'에 해당하는 사용자가 없을 경우 등 Prisma 관련 에러를 처리합니다.
      throw handlePrismaError(err);
    }
  }
}
