// /src/modules/post/post.service.ts

import { PrismaClient, Prisma } from '../../generated/prisma';
import { GraphQLError } from 'graphql';
import { z } from 'zod';

import { handlePrismaError } from '../../utils/error.helper';
import { PostFilterInput, postFilterSchema } from './post.dto';

/**
 * PostService
 * 게시글(Post) 관련 비즈니스 로직을 처리하는 서비스 클래스입니다.
 *
 * 주요 특징
 * - Prisma ORM을 통해 DB와 직접 상호작용합니다.
 * - GraphQL 리졸버(Resolver)에서 호출됩니다.
 * - 입력값에 대한 유효성 검사(Zod) 및 에러 처리를 포함합니다.
 */
export class PostService {
  /**
   * 생성자
   * - PrismaClient를 의존성 주입(DI) 받아서 사용합니다.
   *   (테스트 코드에서 Mocking 또는 외부 Prisma 인스턴스 재사용 가능)
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 특정 사용자 ID 기준으로 게시글 조회
   *
   * @param userId 작성자(User.id)
   * @returns 해당 사용자가 작성한 게시글 배열
   *
   * 활용 맥락
   * - GraphQL 스키마에서 `User.posts` 필드를 resolve할 때 사용됩니다.
   * - ex) `user { posts { id title } }` 쿼리 시 동작
   */
  async getPostsByUserId(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId }, // authorId 컬럼 기준으로 조회
    });
  }

  /**
   * 게시글 목록 조회 (필터 + 정렬 지원) - 단순 테스트용
   *
   * @param args.filter GraphQL에서 전달받은 게시글 조건 (title, published 등)
   * @param args.sort   정렬 기준 (field + asc/desc)
   *
   * @returns 조건/정렬에 맞는 게시글 배열
   */
  // async getFilteredPosts(args: {
  //   filter?: PostFilterInput;
  //   sort?: { field: string; order: 'asc' | 'desc' };
  // }) {
  //   const result = postFilterSchema.safeParse(args);

  //   if (!result.success) {
  //     throw new GraphQLError('입력값이 유효하지 않습니다.', {
  //       extensions: {
  //         code: 'BAD_USER_INPUT',
  //         validationErrors: z.flattenError(result.error),
  //       },
  //     });
  //   }

  //   const parsed = result.data;

  //   const whereClause: Prisma.PostWhereInput = {};
  //   if (parsed.filter?.title) {
  //     whereClause.title = { contains: parsed.filter.title };
  //   }
  //   if (typeof parsed.filter?.published === 'boolean') {
  //     whereClause.published = parsed.filter.published;
  //   }

  //   const orderBy = parsed.sort ? { [parsed.sort.field]: parsed.sort.order } : undefined;

  //   try {
  //     return await this.prisma.post.findMany({
  //       where: whereClause,
  //       orderBy,
  //     });
  //   } catch (error) {
  //     handlePrismaError(error);
  //   }
  // }

  /**
   * 게시글 목록 조회 (필터 + 정렬 지원)
   *
   * @param args.filter GraphQL에서 전달받은 게시글 조건 (title, published, AND/OR/NOT 등)
   * @param args.sort   정렬 기준 (field + asc/desc)
   *
   * @returns 조건/정렬에 맞는 게시글 배열
   *
   * 처리 흐름
   * 1. Zod Schema(postFilterSchema)로 입력값 유효성 검사
   * 2. 검사 실패 시 GraphQL 에러 반환
   * 3. 필터/정렬 인자를 Prisma `where/orderBy` 객체로 변환
   * 4. Prisma의 findMany() 실행
   * 5. Prisma Error 발생 시 공통 핸들러로 위임
   */
  async getFilteredPosts(args: {
    filter?: PostFilterInput;
    sort?: { field: string; order: 'asc' | 'desc' };
  }) {
    // 1. 입력값 검증 (safeParse는 성공/실패 여부를 객체로 반환)
    const result = postFilterSchema.safeParse(args);

    // 2. 검증 실패 → GraphQL 예외 발생
    if (!result.success) {
      throw new GraphQLError('입력값이 유효하지 않습니다.', {
        extensions: {
          code: 'BAD_USER_INPUT', // GraphQL 에러 코드
          validationErrors: z.flattenError(result.error), // Zod 에러 메시지 정리
        },
      });
    }

    // 3. 검증된 안전한 데이터 추출
    const parsed = result.data;

    // 4. GraphQL 필터 → Prisma where 절 변환
    const whereClause = parsed.filter ? this.buildWhere(parsed.filter) : undefined;

    // 5. GraphQL sort → Prisma orderBy 절 변환
    const orderBy = parsed.sort ? { [parsed.sort.field]: parsed.sort.order } : undefined;

    // 6. Prisma findMany() 실행
    try {
      return await this.prisma.post.findMany({
        where: whereClause,
        orderBy,
      });
    } catch (error) {
      // 7. Prisma 예외 발생 시 공통 핸들러 처리
      handlePrismaError(error);
    }
  }

  /**
   * buildWhere()
   *
   * GraphQL의 FilterInput → Prisma PostWhereInput 변환
   *
   * @param filter GraphQL 쿼리 입력 필터
   * @returns Prisma에서 사용할 수 있는 where 조건 객체
   *
   * 매핑 규칙
   * - title: 부분 일치 검색 (contains)
   * - published: boolean 정확 일치
   * - AND/OR/NOT: 재귀적으로 하위 조건까지 변환
   */
  private buildWhere(filter?: PostFilterInput): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {};
    if (!filter) return where;

    /**
     * (2) 단일 필드 조건 처리
     */

    // title → contains (부분 문자열 검색, 대소문자 기본 구분)
    // 예) "GraphQL" → "GraphQL Basics", "Intro to GraphQL" 모두 매칭됨
    if (filter.title) {
      where.title = { contains: filter.title };
    }

    // published → equals (true/false 정확 매칭)
    // 예) true  → 공개된 글만 조회
    //     false → 비공개 글만 조회
    if (typeof filter.published === 'boolean') {
      where.published = { equals: filter.published };
    }

    /**
     * (3) 논리 연산자 처리 (재귀 호출)
     */

    // AND: 배열에 포함된 모든 조건을 동시에 만족해야 함
    // - 배열 내 각 조건을 다시 buildWhere로 변환 (재귀적 처리)
    if (filter.AND && filter.AND.length > 0) {
      where.AND = filter.AND.map((sub) => this.buildWhere(sub));
    }

    // OR: 배열에 포함된 조건 중 하나라도 만족하면 됨
    // - 배열 요소를 순회하면서 각각 재귀 호출
    if (filter.OR && filter.OR.length > 0) {
      where.OR = filter.OR.map((sub) => this.buildWhere(sub));
    }

    // NOT: 특정 조건을 만족하지 않아야 함
    // - 재귀 호출을 통해 깊은 중첩 조건도 처리 가능
    if (filter.NOT && filter.NOT.length > 0) {
      where.NOT = filter.NOT.map((sub) => this.buildWhere(sub));
    }

    return where;
  }
}
