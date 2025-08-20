import { PrismaClient } from '../..//generated/prisma'; // Prisma ORM 클라이언트를 import하여 데이터베이스와 상호작용할 수 있게 합니다.
//import { GraphQLError } from 'graphql'; // GraphQL 에러 클래스를 import하여 에러 발생 시 GraphQL 표준 방식으로 처리할 수 있게 합니다.

import { NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';

/**
 * 주어진 사용자 ID로 데이터베이스에서 사용자 정보를 조회하는 함수입니다.
 * @param id - 조회할 사용자의 고유 ID (number)
 * @param prisma - PrismaClient 인스턴스 (데이터베이스 연결 객체)
 * @returns 조회된 사용자 객체
 * @throws GraphQLError - 사용자가 존재하지 않을 경우 GraphQL 에러를 발생시킵니다.
 */
export const getUserById = async (id: number, prisma: PrismaClient) => {
  // Prisma의 findUnique 메서드를 사용하여 id에 해당하는 사용자 레코드를 조회합니다.
  // where 옵션에 id를 전달하여 해당하는 사용자만 조회합니다.
  const user = await prisma.user.findUnique({
    where: { id }, // 조회 조건: id
  });

  // 조회 결과가 없을 경우(사용자가 존재하지 않을 경우)
  if (!user) {
    // GraphQLError를 발생시켜 클라이언트에 에러 정보를 전달합니다.
    // extensions 필드에 사용자 정의 에러 코드와 조회한 userId를 포함시켜 추가 정보를 제공합니다.
    // throw new GraphQLError(`ID ${id} 번 사용자를 찾을 수 없습니다.`, {
    //   extensions: {
    //     code: 'USER_NOT_FOUND', // 사용자 정의 에러 코드
    //     userId: id, // 조회한 사용자 ID
    //   },
    // });
    logger.info(`User fetched Fail: id=${id}`);
    throw new NotFoundError('User', id);
  }

  logger.info(`User fetched successfully: id=${id}`);
  // 조회된 사용자 정보를 반환합니다.
  return user;
};
