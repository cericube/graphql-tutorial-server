import { PrismaClient } from '../../generated/prisma';
import { GraphQLError } from 'graphql';
import { handlePrismaError } from '../../utils/error.helper';
import { CreatePostInput, UpdatePostInput } from './post.dto';

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true, comments: true },
    });
    if (!post) {
      throw new GraphQLError('게시글을 찾을 수 없습니다.', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return post;
  }

  async getPosts(authorId?: number) {
    return this.prisma.post.findMany({
      where: authorId ? { authorId } : undefined,
      include: { author: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(input: CreatePostInput) {
    try {
      return await this.prisma.post.create({
        data: input,
        include: { author: true, comments: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updatePost(id: number, input: UpdatePostInput) {
    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: input,
        include: { author: true, comments: true },
      });
      return post;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async increasePostLike(id: number) {
    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: {
          likeCount: {
            increment: 1,
          },
        },
        // include: { author: true, comments: true },
      });
      return post;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deletePost(id: number) {
    try {
      // deleted 변수에는 해당 Post 모델의 전체 필드 값이 들어 있습니다.
      const deleted = await this.prisma.post.delete({
        where: { id },
        //일부 필드만 포함된 객체 반환
        // 개인정보 보호가 필요한 경우 필수
        select: {
          id: true,
          title: true,
        },
      });
      return deleted;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
