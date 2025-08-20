import { Context } from '../../context'; // GraphQL 요청 컨텍스트 타입을 import
import { getUserById } from './user.service'; // 사용자 조회 서비스 함수 import

// userResolvers 객체는 GraphQL의 Query 타입에 대한 리졸버를 정의합니다.
// user 쿼리는 id를 받아 해당 사용자의 정보를 반환합니다.
export const userResolvers = {
  Query: {
    // user 쿼리 리졸버 함수
    // _: GraphQL에서 root 객체(사용하지 않으므로 unknown 타입)
    // args: 쿼리에서 전달받은 인자 객체 (id: number)
    // context: 요청별 컨텍스트 (DB 접근 등)
    user: async (_: unknown, args: { id: number }, context: Context) => {
      // getUserById 함수로 id에 해당하는 사용자 정보를 조회하여 반환
      // context.prisma: Prisma ORM 인스턴스(DB 연결)
      return getUserById(args.id, context.prisma);
    },
  },
};
