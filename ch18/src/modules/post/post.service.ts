import { PrismaClient } from '../../generated/prisma';

import { handlePrismaError } from '../../utils/error.helper';

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllWithAuthor() {
    try {
      const posts = await this.prisma.post.findMany();
      return posts;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
