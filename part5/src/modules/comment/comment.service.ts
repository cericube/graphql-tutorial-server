import { PrismaClient } from '../../generated/prisma';
import { handlePrismaError } from '../../utils/error.helper';

import { CreateCommentInput, UpdateCommentInput } from './comment.dto';

export class CommentService {
  constructor(private readonly prisma: PrismaClient) {}

  async getCommentById(id: number) {
    try {
      const comment = this.prisma.comment.findFirstOrThrow({
        where: { id },
      });
      return comment;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getCommentsByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        post: true,
      },
    });
  }

  async getCommentsByUser(authorId: number) {
    return this.prisma.comment.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        post: true,
      },
    });
  }

  async getAllComments() {
    return this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        post: true,
      },
    });
  }

  async createComment(input: CreateCommentInput) {
    try {
      return await this.prisma.comment.create({
        data: input,
        include: { post: true, author: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateComment(id: number, input: UpdateCommentInput) {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: input,
        include: { post: true, author: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteComment(id: number) {
    try {
      await this.prisma.comment.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
