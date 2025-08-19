import { Context } from '../../context';

// 사용자 관련 GraphQL 리졸버 정의
export const userResolvers = {
  Query: {
    /**
     * 사용자 전체 목록 조회 쿼리
     * - 프론트에서 필요한 최소 필드(id, name, email)만 조회
     * - 향후 조건 검색, 정렬, 페이지네이션 확장을 고려한 기본 구조
     */
    users: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.user.findMany({
        orderBy: { id: 'desc' },
        select: { id: true, name: true, email: true },
      });
    },

    /**
     * 특정 사용자 단일 조회 쿼리
     * - 고유 ID 기반 조회
     * - 존재하지 않을 경우 null 반환 (예외 처리 필요 시 다음 단계에서 구현)
     * - select로 필드 제한하여 성능 최적화 및 보안 고려
     */
    user: async (_: unknown, args: { id: string }, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: Number(args.id) },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    },
  },
};
