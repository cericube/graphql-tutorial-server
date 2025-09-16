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

  async deletePost(id: number) {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
