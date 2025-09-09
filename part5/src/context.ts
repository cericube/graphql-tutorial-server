import { PrismaClient, Prisma } from './generated/prisma';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

prisma.$on('query', (e: Prisma.QueryEvent) => {
  console.log('[PRISMA] Query:', e.query);
  console.log('[PRISMA] Params:', e.params);
  console.log('[PRISMA] Duration(ms):', e.duration);
});

/////////////////////////////////////////////////////////
import { UserService } from './modules/user/user.service';
import { PostService } from './modules/post/post.service';
import { CommentService } from './modules/comment/comment.service';

const userService = new UserService(prisma);
const postService = new PostService(prisma);
const commentService = new CommentService(prisma);

export interface GraphQLContext {
  services: {
    userService: UserService;
    postService: PostService;
    commentService: CommentService;
  };
}

export const createContext = (): GraphQLContext => ({
  services: {
    userService,
    postService,
    commentService,
  },
});
