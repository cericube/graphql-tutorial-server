// PrismaClient: Prisma ORM을 통해 데이터베이스에 접근하는 객체를 임포트
import { PrismaClient } from '../../generated/prisma';
// handlePrismaError: Prisma 관련 에러를 처리하는 헬퍼 함수 임포트
import { handlePrismaError } from '../../utils/error.helper';

// UserService 클래스: 사용자 관련 데이터베이스 작업(조회, 생성 등)을 담당하는 서비스 계층
export class UserService {
  // 생성자에서 PrismaClient 인스턴스를 주입받아 클래스 내부에서 DB 접근에 사용
  // 동등한 풀 버전
  // private readonly prisma: PrismaClient;
  // constructor(prisma: PrismaClient) {
  //   this.prisma = prisma;
  // }

  // 클래스가 생성될 때 실행되는 함수입니다. 인스턴스 초기화 용도로 사용됩니다.
  // 생성자에 넘겨줄 인자를 정의합니다. 여기서는 prisma: PrismaClient 타입의 인자
  // private readonly 키워드로 멤버 변수 자동 생성 및 초기화까지 동시에 수행
  constructor(private readonly prisma: PrismaClient) {}

  // 사용자 ID로 사용자 정보를 조회하는 메서드
  // - id: 조회할 사용자의 고유 ID (number)
  // - 성공 시 해당 사용자 객체 반환, 실패 시 에러 처리
  async getUserById(id: number) {
    try {
      // Prisma의 findUniqueOrThrow 메서드를 사용해 ID로 사용자 조회
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch (err) {
      // 조회 중 에러 발생 시 에러 헬퍼 함수로 처리
      handlePrismaError(err);
    }
  }

  // 새로운 사용자 생성 메서드
  // - email: 생성할 사용자의 이메일 (string)
  // - name: 생성할 사용자의 이름 (string)
  // - 성공 시 생성된 사용자 객체 반환, 실패 시 에러 처리
  async createUser(email: string, name: string) {
    try {
      // Prisma의 create 메서드를 사용해 사용자 데이터베이스에 추가
      return await this.prisma.user.create({
        data: { email, name },
      });
    } catch (err) {
      // 생성 중 에러 발생 시 에러 헬퍼 함수로 처리
      handlePrismaError(err);
    }
  }
}
