// /src/modules/post/post.service.ts

import { PrismaClient, Prisma } from '../../generated/prisma';
import { GraphQLError } from 'graphql';
import { z } from 'zod';

import { handlePrismaError } from '../../utils/error.helper';
import { PostFilterInput, postFilterSchema } from './post.dto';

/**
 * PostService
 * 게시글(Post) 관련 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * - Prisma ORM을 통해 데이터베이스와 직접 상호작용합니다.
 * - GraphQL 리졸버에서 호출되며, 유효성 검사 및 예외 처리를 포함합니다.
 */
export class PostService {
  // 의존성 주입: 외부에서 PrismaClient 인스턴스를 받아 사용
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 게시글 목록 조회 (조건 필터링 + 정렬 포함)
   *
   * @param filter GraphQL 쿼리로부터 전달된 필터/정렬 인자
   * @returns 조건에 맞는 게시글 리스트
   *
   * 처리 흐름:
   * 1. Zod를 이용해 filter 인자의 형식 및 값 유효성 검사
   * 2. Prisma의 where/orderBy 객체를 동적으로 생성
   * 3. findMany()로 조건에 맞는 게시글 목록 조회
   * 4. Prisma 예외 발생 시 공통 에러 핸들러 실행
   */
  async getFilteredPosts(filter: PostFilterInput) {
    // 1. Zod로 유효성 검사 수행
    const result = postFilterSchema.safeParse(filter);

    // 2. 검증 실패 시 GraphQL 예외 반환
    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: z.flattenError(result.error),
        },
      });
    }

    // 3. 검증된 안전한 데이터 추출
    const parsed = result.data;

    // 4. Prisma의 where 조건 구성
    const whereClause: Prisma.PostWhereInput = {};
    if (parsed.filter?.title) {
      whereClause.title = { contains: parsed.filter.title };
    }
    if (typeof parsed.filter?.published === 'boolean') {
      whereClause.published = parsed.filter.published;
    }

    // 5. Prisma의 orderBy 조건 구성
    const orderBy = parsed.sort ? { [parsed.sort.field]: parsed.sort.order } : undefined;

    // 6. 최종 게시글 목록 조회
    try {
      return await this.prisma.post.findMany({
        where: whereClause,
        orderBy,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * 특정 사용자 ID 기준 게시글 조회
   *
   * @param userId 작성자 ID (User.id)
   * @returns 해당 사용자가 작성한 게시글 목록
   *
   * 이 메서드는 `User.posts` 타입 필드 리졸버에서 사용됩니다.
   */
  async getPostsByUserId(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
    });
  }
}
