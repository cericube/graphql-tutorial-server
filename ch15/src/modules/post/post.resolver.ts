// /src/modules/post/post.resolver.ts

import { GraphQLContext } from '../../context';
import { CreatePostInput } from './post.types';

// GraphQL Resolver 정의
export const postResolvers = {
  Mutation: {
    /**
     * 이 Resolver 함수는 input을 받아서 postService로 위임합니다.
     * 핵심 비즈니스 로직은 service 레이어에서 처리됩니다.
     *
     * @param _parent - 부모 리졸버의 반환값 (여기선 사용되지 않음)
     * @param args - GraphQL Mutation에서 전달한 인자, input 필드 포함
     * @param context - GraphQLContext (Prisma client, 인증 정보, service 등 포함)
     * @returns 생성된 게시글(Post) 객체를 반환합니다.
     */
    createPost: async (
      _parent: unknown,
      args: { input: CreatePostInput },
      context: GraphQLContext
    ) => {
      // 서비스 레이어에 input을 넘겨 게시글 생성 로직 실행
      // → create, connect, connectOrCreate, include 처리 포함
      return context.services.postService.createPost(args.input);
    },
  },
};
