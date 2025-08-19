// src/modules/user/user.service.ts
// ------------------------------------------------------------
// User 서비스 계층
// ------------------------------------------------------------
// - 리졸버에서 호출되는 비즈니스 로직을 구현합니다.
// - DB 접근은 Prisma Client를 사용하며, 이 계층에서만 수행합니다.
//   → 이렇게 하면 리졸버는 데이터 요청 흐름에만 집중하고,
//     DB 관련 변경이 필요할 때는 서비스 계층만 수정하면 됩니다.
// - 여기서는 User 전체 조회와 단일 조회 기능을 제공합니다.
// ------------------------------------------------------------

import prisma from '../../lib/prisma'; // 싱글톤 Prisma Client 인스턴스 불러오기

export const userService = {
  // 모든 User 데이터 조회
  // - prisma.user.findMany(): User 테이블의 전체 레코드 반환
  getAll: () => prisma.user.findMany(),

  // 특정 ID의 User 데이터 조회
  // - prisma.user.findUnique(): 조건(where)에 맞는 단일 레코드 반환
  // - { where: { id } }: id가 일치하는 User를 검색
  getById: (id: number) => prisma.user.findUnique({ where: { id } }),
};

// Test 코드
// async function testPrisma() {
//   try {
//     const users = await prisma.user.findMany();
//     console.log('Users:', users);
//   } catch (error) {
//     console.error('Error querying users:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// testPrisma();
