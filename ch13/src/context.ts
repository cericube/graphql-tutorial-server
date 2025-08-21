// PrismaClient를 통해 데이터베이스 연결 및 ORM 기능 제공
import { PrismaClient } from './generated/prisma';

// 사용자 관련 비즈니스 로직을 처리하는 서비스 클래스 임포트
import { UserService } from './modules/user/user.service';

// Prisma 인스턴스 생성 (애플리케이션 전체에서 공유)
const prisma = new PrismaClient();

// UserService 인스턴스 생성, PrismaClient를 주입하여 DB 접근 가능하게 함
const userService = new UserService(prisma);

// interface는 TypeScript에서 객체의 구조(속성과 타입)를 정의하는 키워드입니다.
// GraphQL 요청 컨텍스트 타입 정의(사용자 정의)
// 각 요청마다 서비스 객체를 포함하여 리졸버에서 접근 가능하도록 함
export interface GraphQLContext {
  services: {
    userService: UserService;
  };
}

// GraphQL 요청 컨텍스트 생성 함수
// 각 요청마다 필요한 서비스 객체를 포함한 컨텍스트 반환
export const createContext = (): GraphQLContext => ({
  services: {
    userService,
  },
});
