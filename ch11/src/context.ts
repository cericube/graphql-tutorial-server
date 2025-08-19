// src/context.ts

// PrismaClient를 불러옵니다.
// 일반적으로는 '@prisma/client'에서 가져오지만,
// 이 예제에서는 './generated/prisma'로 사용자 정의 경로에서 import된 상태입니다.
import { PrismaClient } from './generated/prisma';

// PrismaClient 인스턴스를 생성합니다.
// 애플리케이션 전체에서 단일 인스턴스로 관리하는 것이 바람직합니다.
const prisma = new PrismaClient();

// GraphQL context 객체의 타입을 정의합니다.
// 이 타입은 각 요청(Request)마다 생성되는 context 객체에 포함될 속성을 명시합니다.
export interface Context {
  prisma: PrismaClient;
}

// context 생성 함수입니다.
// GraphQL Yoga에서 context를 설정할 때 사용되며,
// 리졸버에서 context.prisma 형태로 Prisma Client에 접근할 수 있게 됩니다.
export const createContext = (): Context => ({
  prisma,
});
