// /src/modules/post/post.service.ts

// PrismaClient 타입을 import (보통 타입 정의된 경로를 alias로 지정하기도 함)
import { PrismaClient } from '../../generated/prisma';

// 공통 에러 핸들러 (Prisma 예외를 일관된 형태로 가공)
import { handlePrismaError } from '../../utils/error.helper';

// GraphQL input 타입 정의 import (CreatePostInput은 title, userId, categories 필드 포함)
import { CreatePostInput } from './post.types';

// 게시글 관련 DB 로직을 담당하는 서비스 클래스
export class PostService {
  // 생성자에서 prisma 클라이언트를 주입받음 (DI 패턴, 테스트에도 유리)
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 게시글 생성 메서드
   * - 사용자를 외래키로 연결
   * - 카테고리는 connectOrCreate로 처리 (존재하면 연결, 없으면 생성)
   * @param input - 게시글 생성에 필요한 입력 데이터
   * @returns 생성된 Post 객체 (user, categories 포함)
   */
  async createPost(input: CreatePostInput) {
    try {
      // 게시글(Post) 생성 로직
      const post = await this.prisma.post.create({
        data: {
          // 게시글 제목 설정
          title: input.title,
          // 사용자(User) 연결
          user: {
            connect: {
              id: input.userId, // 외래키 기반으로 user 연결 (userId는 이미 존재하는 사용자여야 함)
            },
          },
          // 카테고리(Category) 다대다 관계 처리
          categories: input.categories?.length
            ? {
                connectOrCreate: input.categories.map((category) => ({
                  // connect 단계: 동일한 이름(name)을 가진 카테고리가 이미 존재하는지 확인
                  where: { name: category.name },
                  // create 단계: 존재하지 않으면 새롭게 카테고리 생성
                  create: { name: category.name },
                })),
              }
            : undefined,
        },
        // 응답 데이터 구성 설정
        include: {
          // 연결된 작성자 정보도 응답에 포함 (user 객체 전체 반환)
          user: true,
          // 연결된 카테고리 목록도 응답에 포함 (categories 배열로 반환)
          categories: true,
        },
      });

      // 생성된 게시글(post) 객체 반환
      return post;
    } catch (err) {
      console.log(err);
      // Prisma 예외를 공통 핸들러를 통해 가공 후 다시 throw
      throw handlePrismaError(err);
    }
  }
}
