import { GraphQLContext } from '../../context';
import { CreatePostInput, createPostSchema, UpdatePostInput, updatePostSchema } from './post.dto';
import { throwInputValidationError } from '../../utils/error.validation';

export const postResolvers = {
  Query: {
    post: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.postService.getPostById(args.id);
    },

    posts: async (_parent: unknown, args: { authorId?: number }, context: GraphQLContext) => {
      return context.services.postService.getPosts(args.authorId);
    },
  },

  Mutation: {
    createPost: async (
      _parent: unknown,
      args: { input: CreatePostInput },
      context: GraphQLContext
    ) => {
      const result = createPostSchema.safeParse(args.input);
      if (!result.success) {
        throwInputValidationError(result.error);
      }
      // 검증 통과
      return context.services.postService.createPost(result.data);
    },

    updatePost: async (
      _parent: unknown,
      args: { id: number; input: UpdatePostInput },
      context: GraphQLContext
    ) => {
      const result = updatePostSchema.safeParse(args.input);
      if (!result.success) {
        throwInputValidationError(result.error);
      }
      // 검증 통과
      return context.services.postService.updatePost(args.id, args.input);
    },

    increasePostLike: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.postService.increasePostLike(args.id);
    },

    deletePost: async (_parent: unknown, args: { id: number }, context: GraphQLContext) => {
      return context.services.postService.deletePost(args.id);
    },
  },
};
