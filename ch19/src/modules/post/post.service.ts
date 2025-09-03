// /src/modules/post/post.service.ts
// -----------------------------------------------------------------------------
// PostService
// - Post 도메인과 관련된 비즈니스 로직을 담당합니다.
// - GraphQL 리졸버에서는 이 서비스를 호출하여 Prisma ORM과 상호작용합니다.
// - 예외 발생 시 handlePrismaError를 통해 일관된 에러 포맷으로 변환합니다.
// -----------------------------------------------------------------------------

import { PrismaClient, Prisma } from '../../generated/prisma';
import { handlePrismaError } from '../../utils/error.helper';
import { PostsArgs } from './post.dto';

export class PostService {
  // 외부에서 PrismaClient를 주입받아 사용합니다(테스트/모킹 용이).
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 단일 게시글 조회
   * @param id 게시글 고유 ID
   * @returns 존재하면 Post, 없으면 null
   *
   * - findUnique는 PK/Unique 인덱스를 이용해 단건 조회합니다.
   * - 예외는 공통 에러 핸들러로 위임합니다.
   */
  async findById(id: number) {
    try {
      return await this.prisma.post.findUnique({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * 게시글 목록 조회 (필터/정렬/페이지네이션)
   * @param args PostsArgs (Zod로 선검증 권장: parsePostsArgs)
   * @returns Post 배열
   *
   * - where: 제목 부분 일치, 발행 여부 등 조건을 Prisma PostWhereInput으로 매핑합니다.
   * - orderBy: 정렬 기준(field + direction)을 Prisma 형식으로 동적 키 매핑합니다.
   * - skip/take: 페이지네이션. undefined를 넘기면 Prisma가 해당 옵션을 무시합니다.
   */
  async findMany(args: PostsArgs) {
    // Prisma where 조건 객체를 동적으로 구성합니다.
    const where: Prisma.PostWhereInput = {};

    // 제목 부분 일치(contains). 대소문자 민감성은 DB/컬레이션에 따라 달라질 수 있습니다.
    if (args?.filter?.titleContains) {
      where.title = { contains: args.filter.titleContains };
    }

    // 발행 여부 필터: true/false가 명시적으로 들어온 경우에만 적용합니다.
    if (typeof args?.filter?.published === 'boolean') {
      where.published = args.filter.published;
    }

    // 정렬 옵션 매핑: { [field]: direction } 형태로 동적 키를 구성합니다.
    let orderBy: Prisma.PostOrderByWithRelationInput | undefined = undefined;
    if (args?.orderBy) {
      orderBy = { [args.orderBy.field]: args.orderBy.direction };
    }

    // findMany 호출
    // - skip/take를 undefined로 넘기면 해당 옵션은 무시됩니다.
    // - orderBy가 undefined면 정렬 없이 반환됩니다.
    return await this.prisma.post.findMany({
      where,
      skip: args?.skip ?? undefined,
      take: args?.take ?? undefined,
      orderBy,
    });
  }

  /**
   * 특정 사용자(authorId)의 게시글 목록 조회
   * @param userId 작성자(User) ID
   * @returns 해당 사용자의 Post 배열
   *
   * - User 타입의 posts 필드 리졸버에서 호출되어 N+1 재현/분석에 사용됩니다.
   * - DataLoader 최적화는 Post.author(작성자 조회) 측에 적용되어 있습니다.
   */
  async findPostsByUserId(userId: number) {
    try {
      return await this.prisma.post.findMany({
        where: { authorId: userId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
